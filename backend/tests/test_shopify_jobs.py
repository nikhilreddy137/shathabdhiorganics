"""Iteration 5: Shopify background push/sync jobs against the REAL connected store.

Modules under test:
  - POST /api/admin/shopify/push  -> {status: started} (non-blocking)
  - GET  /api/admin/shopify/push/status -> running -> done {result:{created,updated,failed,total,skipped_images}}
  - POST /api/admin/shopify/sync  -> {status: started}
  - GET  /api/admin/shopify/sync/status -> running -> done {result:{synced,removed,skipped}}
  - 409 when a job is already in progress
  - product count stability / no duplicates / category preservation
"""
import os
import time

import pytest
import requests
from dotenv import dotenv_values
from pymongo import MongoClient

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
BASE = (os.environ.get("REACT_APP_BACKEND_URL") or frontend_env["REACT_APP_BACKEND_URL"]).rstrip("/") + "/api"
ADMIN_KEY = backend_env.get("ADMIN_PANEL_KEY")
ADMIN_HDR = {"X-Admin-Key": ADMIN_KEY or ""}
MONGO_URL = backend_env.get("MONGO_URL")
DB_NAME = backend_env.get("DB_NAME")

REAL_DOMAIN = "c33fcd-d5.myshopify.com"
POLL_TIMEOUT = 420


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def mongo():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


def _wait_idle(api, job):
    """Wait for any in-flight job to finish so tests start from a clean slate."""
    for _ in range(POLL_TIMEOUT // 3):
        r = api.get(f"{BASE}/admin/shopify/{job}/status", headers=ADMIN_HDR)
        if r.json().get("status") != "running":
            return r.json()
        time.sleep(3)
    pytest.fail(f"{job} job stuck in running")


def _poll(api, job, timeout=POLL_TIMEOUT):
    deadline = time.time() + timeout
    saw_running = False
    while time.time() < deadline:
        r = api.get(f"{BASE}/admin/shopify/{job}/status", headers=ADMIN_HDR)
        assert r.status_code == 200, r.text
        d = r.json()
        if d.get("status") == "running":
            saw_running = True
        elif d.get("status") in ("done", "error"):
            return d, saw_running
        time.sleep(3)
    pytest.fail(f"{job} did not complete within {timeout}s")


# ---------- connection precondition ----------
class TestPrecondition:
    def test_admin_key_present(self):
        assert ADMIN_KEY

    def test_store_connected(self, api):
        r = api.get(f"{BASE}/admin/shopify/settings")
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["connected"] is True
        assert d["domain"] == REAL_DOMAIN
        assert d["has_admin_token"] is True
        assert d["has_storefront_token"] is True

    def test_status_endpoints_require_admin_key(self, api):
        for job in ("push", "sync"):
            r = api.get(f"{BASE}/admin/shopify/{job}/status")
            assert r.status_code == 401, f"{job} status unauth -> {r.status_code}"
            r2 = api.get(f"{BASE}/admin/shopify/{job}/status", headers={"X-Admin-Key": "wrong"})
            assert r2.status_code == 401

    def test_unique_sparse_index_exists(self, mongo):
        idx = mongo.products.index_information()
        assert "shopify_product_id_1" in idx
        assert idx["shopify_product_id_1"].get("unique") is True
        assert idx["shopify_product_id_1"].get("sparse") is True


# ---------- PUSH background job ----------
class TestPushJob:
    def test_push_returns_immediately(self, api):
        _wait_idle(api, "push")
        t0 = time.time()
        r = api.post(f"{BASE}/admin/shopify/push", headers=ADMIN_HDR, timeout=30)
        elapsed = time.time() - t0
        print(f"push start elapsed={elapsed:.2f}s status={r.status_code} body={r.text[:200]}")
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "started"
        assert elapsed < 5, f"push blocked for {elapsed:.1f}s (should return immediately)"

    def test_second_push_returns_409(self, api):
        r = api.post(f"{BASE}/admin/shopify/push", headers=ADMIN_HDR, timeout=30)
        print(f"second push -> {r.status_code} {r.text[:200]}")
        assert r.status_code == 409, r.text
        assert "already in progress" in r.json()["detail"].lower()

    def test_push_completes_without_failures(self, api):
        d, saw_running = _poll(api, "push")
        print(f"push final={ {k: v for k, v in d.items() if k != 'result'} } result={d.get('result')}")
        assert saw_running, "never observed status=running (job may have been synchronous)"
        assert d["status"] == "done", f"push errored: {d.get('error')}"
        res = d["result"]
        for k in ("created", "updated", "failed", "total", "skipped_images"):
            assert k in res, f"missing {k} in push result"
        assert res["failed"] == [], f"products failed to push: {res['failed']}"
        assert res["total"] > 0
        assert res["created"] + res["updated"] == res["total"]
        assert isinstance(res["skipped_images"], list)


# ---------- SYNC background job ----------
class TestSyncJob:
    def test_sync_returns_immediately(self, api):
        _wait_idle(api, "sync")
        t0 = time.time()
        r = api.post(f"{BASE}/admin/shopify/sync", headers=ADMIN_HDR, timeout=30)
        elapsed = time.time() - t0
        print(f"sync start elapsed={elapsed:.2f}s status={r.status_code} body={r.text[:200]}")
        assert r.status_code == 200, r.text
        assert r.json()["status"] == "started"
        assert elapsed < 5

    def test_second_sync_returns_409(self, api):
        r = api.post(f"{BASE}/admin/shopify/sync", headers=ADMIN_HDR, timeout=30)
        assert r.status_code == 409, r.text
        assert "already in progress" in r.json()["detail"].lower()

    def test_sync_completes(self, api):
        d, saw_running = _poll(api, "sync")
        print(f"sync final result={d.get('result')} error={d.get('error')}")
        assert d["status"] == "done", f"sync errored: {d.get('error')}"
        res = d["result"]
        for k in ("synced", "removed", "skipped"):
            assert k in res
        assert res["synced"] > 0
        assert res["skipped"] == [], f"products skipped in sync: {res['skipped']}"


# ---------- catalog integrity after push+sync ----------
class TestCatalogAfterCycle:
    def test_no_duplicates_and_categorized(self, api, mongo):
        r = api.get(f"{BASE}/products", params={"per_page": 100})
        assert r.status_code == 200, r.text
        d = r.json()
        total = d["total"]
        print(f"products total={total}")
        assert 60 <= total <= 90, f"unexpected product total {total}"
        names = [p["name"] for p in d["products"]]
        dupes = {n for n in names if names.count(n) > 1}
        assert not dupes, f"duplicate product names: {dupes}"
        sids = [p.get("shopify_product_id") for p in mongo.products.find()]
        assert len(sids) == len(set(sids)), "duplicate shopify_product_id in db"
        assert all("_id" not in p for p in d["products"])

        cats = {p.get("category") for p in d["products"]}
        print(f"categories={sorted(c for c in cats if c)}")
        assert "Uncategorized" not in cats, "products lost their category on sync"
        expected = {"Millets", "Spices & Powders", "Rices", "Oils", "Dals",
                    "Cookies", "Snacks & Bars", "Sweets & Treats", "Health Drinks", "Processed Products"}
        assert expected.issubset(cats), f"missing categories: {expected - cats}"

    def test_every_category_endpoint_returns_products(self, api):
        cats = api.get(f"{BASE}/categories").json()
        assert cats, "no categories"
        empty = []
        for c in cats:
            name = c["name"] if isinstance(c, dict) else c
            r = api.get(f"{BASE}/products", params={"category": name, "per_page": 100})
            assert r.status_code == 200, r.text
            if r.json()["total"] == 0:
                empty.append(name)
        assert not empty, f"categories with zero products: {empty}"

    def test_products_have_valid_images(self, api):
        d = api.get(f"{BASE}/products", params={"per_page": 100}).json()
        broken = [p["name"] for p in d["products"] if not (p.get("image") or "").strip()]
        print(f"products without image: {len(broken)} -> {broken[:10]}")
        assert len(broken) == 0, f"{len(broken)} products have no image after sync"


# ---------- idempotency: second full cycle must not grow the catalog ----------
class TestIdempotency:
    def test_second_push_sync_cycle_stable(self, api):
        before = api.get(f"{BASE}/products", params={"per_page": 100}).json()["total"]

        _wait_idle(api, "push")
        assert api.post(f"{BASE}/admin/shopify/push", headers=ADMIN_HDR, timeout=30).status_code == 200
        d, _ = _poll(api, "push")
        assert d["status"] == "done", d.get("error")
        print(f"cycle2 push result={d['result']}")
        assert d["result"]["created"] == 0, f"push created {d['result']['created']} duplicates on 2nd run"
        assert d["result"]["failed"] == []

        _wait_idle(api, "sync")
        assert api.post(f"{BASE}/admin/shopify/sync", headers=ADMIN_HDR, timeout=30).status_code == 200
        d2, _ = _poll(api, "sync")
        assert d2["status"] == "done", d2.get("error")
        print(f"cycle2 sync result={d2['result']}")

        after = api.get(f"{BASE}/products", params={"per_page": 100}).json()["total"]
        print(f"total before={before} after={after}")
        assert after == before, f"product total grew from {before} to {after} after a 2nd push+sync"
