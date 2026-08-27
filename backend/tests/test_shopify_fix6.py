"""Iteration 6 (narrow follow-up to iteration 5): verify only the 3 fixes.

1. push completes with result.failed == []  (E11000 duplicate-key / ambiguous-title matcher fix)
2. sync preserves local `image` when Shopify has none (~10 imageless, not 38)
3. race fix: status set to 'running' synchronously -> back-to-back POST push => 409
4. regression: 75 products, no duplicate shopify_product_id, categories sum to 75
"""
import os
import time
from concurrent.futures import ThreadPoolExecutor

import pytest
import requests
from dotenv import dotenv_values

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
BASE = (os.environ.get("REACT_APP_BACKEND_URL") or frontend_env["REACT_APP_BACKEND_URL"]).rstrip("/") + "/api"
ADMIN_HDR = {"X-Admin-Key": backend_env.get("ADMIN_PANEL_KEY") or ""}
POLL_TIMEOUT = 420


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _wait_idle(api, job):
    for _ in range(POLL_TIMEOUT // 3):
        r = api.get(f"{BASE}/admin/shopify/{job}/status", headers=ADMIN_HDR)
        if r.json().get("status") != "running":
            return r.json()
        time.sleep(3)
    pytest.fail(f"{job} stuck in running")


def _poll(api, job, timeout=POLL_TIMEOUT):
    deadline = time.time() + timeout
    while time.time() < deadline:
        r = api.get(f"{BASE}/admin/shopify/{job}/status", headers=ADMIN_HDR)
        assert r.status_code == 200, r.text
        d = r.json()
        if d.get("status") in ("done", "error"):
            return d
        time.sleep(3)
    pytest.fail(f"{job} did not finish in {timeout}s")


def _products(api):
    r = api.get(f"{BASE}/products", params={"per_page": 100}, timeout=60)
    assert r.status_code == 200, r.text
    return r.json()


class TestShopifyFixes:
    """Ordered: concurrency -> push -> sync -> data assertions."""

    def test_1_concurrent_push_second_gets_409(self, api):
        """Race fix: fire two POSTs as close together as possible; exactly one must win."""
        _wait_idle(api, "push")

        def fire(_):
            return api.post(f"{BASE}/admin/shopify/push", headers=ADMIN_HDR, timeout=30)

        with ThreadPoolExecutor(max_workers=2) as ex:
            responses = list(ex.map(fire, range(2)))
        codes = sorted(r.status_code for r in responses)
        conflict = [r for r in responses if r.status_code == 409]
        assert codes == [200, 409], f"expected exactly one 200 and one 409, got {codes}"
        assert "already in progress" in conflict[0].text.lower(), conflict[0].text

    def test_2_push_completes_without_failures(self, api):
        """The push started in test_1 must finish with an empty failed list (no E11000)."""
        d = _poll(api, "push")
        assert d["status"] == "done", d
        res = d["result"]
        assert res["failed"] == [], f"push failed for: {res['failed']}"
        assert res["total"] == 75, res
        assert res["created"] + res["updated"] == res["total"], res

    def test_3_sync_completes(self, api):
        _wait_idle(api, "sync")
        r = api.post(f"{BASE}/admin/shopify/sync", headers=ADMIN_HDR, timeout=30)
        assert r.status_code == 200, r.text
        d = _poll(api, "sync")
        assert d["status"] == "done", d
        assert d["result"]["synced"] >= 75, d["result"]

    def test_4_images_preserved_after_sync(self, api):
        data = _products(api)
        imageless = [p["name"] for p in data["products"] if not (p.get("image") or "").strip()]
        assert len(imageless) <= 12, f"{len(imageless)} products lost/lack images: {imageless}"

    def test_5_no_duplicates_and_75_total(self, api):
        data = _products(api)
        assert data["total"] == 75, data["total"]
        products = data["products"]
        names = [p["name"] for p in products]
        sids = [p.get("shopify_product_id") for p in products if p.get("shopify_product_id")]
        assert len(sids) == len(set(sids)), "duplicate shopify_product_id in local products"
        assert len(sids) == 75, f"only {len(sids)}/75 products mapped to Shopify"
        assert len(names) == 75

    def test_6_categories_sum_to_75(self, api):
        products = _products(api)["products"]
        counts = {}
        for p in products:
            counts[p.get("category")] = counts.get(p.get("category"), 0) + 1
        assert sum(counts.values()) == 75, counts
        r = api.get(f"{BASE}/categories", timeout=30)
        assert r.status_code == 200, r.text
        real = {c["name"] for c in r.json()}
        missing = real - set(counts)
        assert not missing, f"categories with zero products: {missing} (counts={counts})"
        print("category counts:", counts)
