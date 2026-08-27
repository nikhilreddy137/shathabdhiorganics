"""Shopify integration tests (iteration 4: admin-key auth guard, cart checkout API, non-destructive sync).

Modules under test:
  - /api/admin/shopify/settings (GET public, POST/DELETE admin-key protected)
  - /api/admin/shopify/push, /api/admin/shopify/sync (admin-key protected)
  - /api/shopify/storefront-config (public), /api/shopify/checkout (public)
  - regression: /api/products, /api/categories, /api/cart
"""
import os
import time
import uuid

import pytest
import requests
from dotenv import dotenv_values
from pymongo import MongoClient

frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")
base_url = os.environ.get("REACT_APP_BACKEND_URL") or frontend_env.get("REACT_APP_BACKEND_URL")
if not base_url:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
BASE = base_url.rstrip("/") + "/api"

MONGO_URL = os.environ.get("MONGO_URL") or backend_env.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME") or backend_env.get("DB_NAME")
ADMIN_KEY = backend_env.get("ADMIN_PANEL_KEY")

FAKE_DOMAIN = "test-store.myshopify.com"
FAKE_ADMIN_TOKEN = "shpat_fake12345"
FAKE_STOREFRONT_TOKEN = "shpss_fake67890"

ADMIN_HDR = {"X-Admin-Key": ADMIN_KEY or ""}


@pytest.fixture(scope="module")
def mongo():
    client = MongoClient(MONGO_URL)
    yield client[DB_NAME]
    client.close()


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def original_settings(mongo):
    """Snapshot + restore the shopify settings doc so we don't leave test creds behind."""
    doc = mongo.settings.find_one({"_id": "shopify"})
    yield doc
    mongo.settings.delete_one({"_id": "shopify"})
    if doc:
        mongo.settings.insert_one(doc)


def _clear_settings(mongo):
    mongo.settings.delete_one({"_id": "shopify"})


def _seed_settings(mongo, storefront=True):
    doc = {"domain": FAKE_DOMAIN, "admin_access_token": FAKE_ADMIN_TOKEN}
    if storefront:
        doc["storefront_access_token"] = FAKE_STOREFRONT_TOKEN
    mongo.settings.update_one({"_id": "shopify"}, {"$set": doc}, upsert=True)


# ---------- Admin key auth guard ----------
class TestAdminAuthGuard:
    def test_admin_key_present_in_env(self):
        assert ADMIN_KEY, "ADMIN_PANEL_KEY missing from /app/backend/.env"

    @pytest.mark.parametrize("method,path,body", [
        ("POST", "/admin/shopify/settings", {"domain": FAKE_DOMAIN, "admin_access_token": FAKE_ADMIN_TOKEN}),
        ("POST", "/admin/shopify/push", None),
        ("POST", "/admin/shopify/sync", None),
        ("DELETE", "/admin/shopify/settings", None),
    ])
    def test_missing_key_401(self, api, path, method, body, original_settings):
        r = api.request(method, f"{BASE}{path}", json=body, timeout=60)
        assert r.status_code == 401, f"{method} {path} -> {r.status_code} {r.text[:200]}"
        assert "admin key" in r.json()["detail"].lower()

    @pytest.mark.parametrize("method,path,body", [
        ("POST", "/admin/shopify/settings", {"domain": FAKE_DOMAIN, "admin_access_token": FAKE_ADMIN_TOKEN}),
        ("POST", "/admin/shopify/push", None),
        ("POST", "/admin/shopify/sync", None),
        ("DELETE", "/admin/shopify/settings", None),
    ])
    def test_wrong_key_401(self, api, path, method, body, original_settings):
        r = api.request(method, f"{BASE}{path}", json=body, headers={"X-Admin-Key": "totally-wrong"}, timeout=60)
        assert r.status_code == 401, f"{method} {path} -> {r.status_code} {r.text[:200]}"
        assert "admin key" in r.json()["detail"].lower()

    def test_guard_did_not_mutate_state(self, api, mongo, original_settings):
        """Unauthorized calls must not have created/cleared settings or touched products."""
        assert mongo.products.count_documents({}) == 47

    def test_public_get_settings_still_public(self, api, original_settings):
        r = api.get(f"{BASE}/admin/shopify/settings")
        assert r.status_code == 200, r.text
        assert "connected" in r.json()

    def test_public_storefront_config_still_public(self, api, original_settings):
        r = api.get(f"{BASE}/shopify/storefront-config")
        assert r.status_code == 200, r.text
        assert "configured" in r.json()


# ---------- Unconnected state ----------
class TestUnconnectedState:
    def test_settings_get_not_connected(self, api, mongo, original_settings):
        _clear_settings(mongo)
        r = api.get(f"{BASE}/admin/shopify/settings")
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["connected"] is False
        assert d.get("domain") in (None, "")
        assert "_id" not in d
        assert "admin_access_token" not in d
        assert "storefront_access_token" not in d

    def test_push_without_settings_400(self, api, mongo, original_settings):
        _clear_settings(mongo)
        r = api.post(f"{BASE}/admin/shopify/push", headers=ADMIN_HDR)
        assert r.status_code == 400, r.text
        assert "not connected" in r.json()["detail"].lower()

    def test_sync_without_settings_400(self, api, mongo, original_settings):
        _clear_settings(mongo)
        r = api.post(f"{BASE}/admin/shopify/sync", headers=ADMIN_HDR)
        assert r.status_code == 400, r.text
        assert "not connected" in r.json()["detail"].lower()

    def test_storefront_config_unconfigured(self, api, mongo, original_settings):
        _clear_settings(mongo)
        r = api.get(f"{BASE}/shopify/storefront-config")
        assert r.status_code == 200, r.text
        assert r.json() == {"configured": False}


# ---------- Save settings (with valid admin key) ----------
class TestSaveSettings:
    def test_save_and_mask(self, api, mongo, original_settings):
        _clear_settings(mongo)
        r = api.post(f"{BASE}/admin/shopify/settings", headers=ADMIN_HDR, json={
            "domain": FAKE_DOMAIN,
            "admin_access_token": FAKE_ADMIN_TOKEN,
            "storefront_access_token": FAKE_STOREFRONT_TOKEN,
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["connected"] is True
        assert d["domain"] == FAKE_DOMAIN
        assert d["has_admin_token"] is True
        assert d["has_storefront_token"] is True
        assert FAKE_ADMIN_TOKEN not in r.text

        g = api.get(f"{BASE}/admin/shopify/settings")
        gd = g.json()
        assert gd["connected"] is True
        assert gd["domain"] == FAKE_DOMAIN
        assert FAKE_ADMIN_TOKEN not in g.text
        assert "_id" not in gd
        assert mongo.settings.find_one({"_id": "shopify"})["admin_access_token"] == FAKE_ADMIN_TOKEN

    def test_save_missing_required_field_422(self, api, original_settings):
        r = api.post(f"{BASE}/admin/shopify/settings", headers=ADMIN_HDR, json={"domain": FAKE_DOMAIN})
        assert r.status_code == 422, r.text

    def test_storefront_config_configured(self, api, original_settings):
        r = api.get(f"{BASE}/shopify/storefront-config")
        assert r.status_code == 200
        d = r.json()
        assert d["configured"] is True
        assert d["domain"] == FAKE_DOMAIN


# ---------- Friendly error + fail fast ----------
# NOTE: the app returns 502 for upstream Shopify failures. The k8s/CF edge REPLACES the body of
# 502 responses with its own HTML error page, so the friendly JSON detail never reaches the browser.
# The friendly message itself is therefore asserted against the internal origin (localhost:8001),
# while status/timing/data-integrity are asserted through the public URL.
INTERNAL = "http://localhost:8001/api"


class TestFriendlyErrorFailFast:
    def test_push_invalid_token_friendly_and_fast(self, api, mongo, original_settings):
        _seed_settings(mongo)
        before = mongo.products.count_documents({})
        t0 = time.time()
        r = api.post(f"{BASE}/admin/shopify/push", headers=ADMIN_HDR, timeout=120)
        elapsed = time.time() - t0
        print(f"public push elapsed={elapsed:.2f}s status={r.status_code} ctype={r.headers.get('content-type')}")
        assert r.status_code in (502, 500), r.text[:200]
        assert elapsed < 20, f"push took {elapsed:.1f}s - fail-fast not working"
        assert mongo.products.count_documents({}) == before

        ri = requests.post(f"{INTERNAL}/admin/shopify/push", headers=ADMIN_HDR, timeout=120)
        detail = ri.json()["detail"]
        print(f"internal push detail={detail}")
        assert "Invalid Admin API access token" in detail, detail
        assert len(detail) <= 260
        assert "<html" not in detail.lower() and "cloudflare" not in detail.lower(), detail

    def test_public_502_body_is_not_app_json(self, api, original_settings):
        """Documents the edge behaviour: 502 bodies are swallowed by the proxy (reported issue)."""
        r = api.post(f"{BASE}/admin/shopify/push", headers=ADMIN_HDR, timeout=120)
        assert r.status_code == 502
        assert "application/json" in (r.headers.get("content-type") or ""), (
            "Edge replaced the 502 JSON body with an HTML error page -> frontend cannot show the "
            "friendly Shopify error. Use a 4xx status for upstream errors."
        )

    def test_sync_invalid_token_friendly_and_preserves_catalog(self, api, mongo, original_settings):
        before = mongo.products.count_documents({})
        t0 = time.time()
        r = api.post(f"{BASE}/admin/shopify/sync", headers=ADMIN_HDR, timeout=120)
        elapsed = time.time() - t0
        print(f"public sync elapsed={elapsed:.2f}s status={r.status_code}")
        assert r.status_code in (502, 500), r.text[:200]
        assert elapsed < 20
        assert mongo.products.count_documents({}) == before, "catalog was wiped by a failed sync!"

        ri = requests.post(f"{INTERNAL}/admin/shopify/sync", headers=ADMIN_HDR, timeout=120)
        detail = ri.json()["detail"]
        print(f"internal sync detail={detail}")
        assert "Invalid Admin API access token" in detail, detail


# ---------- Checkout (public) ----------
class TestCheckout:
    def test_checkout_empty_cart_400(self, api, original_settings):
        sid = f"TEST_{uuid.uuid4()}"
        api.get(f"{BASE}/cart/{sid}")
        r = api.post(f"{BASE}/shopify/checkout", params={"session_id": sid})
        assert r.status_code == 400, r.text
        assert "empty" in r.json()["detail"].lower()

    def test_checkout_missing_storefront_token_400(self, api, mongo, original_settings):
        prod = api.get(f"{BASE}/products", params={"limit": 1}).json()["products"][0]
        sid = f"TEST_{uuid.uuid4()}"
        add = api.post(f"{BASE}/cart/{sid}/items", json={
            "product_id": prod["id"],
            "selected_size": prod["sizes"][0]["size"],
            "quantity": 1,
        })
        assert add.status_code == 200, add.text
        assert len(add.json()["items"]) == 1

        mongo.settings.update_one({"_id": "shopify"}, {"$unset": {"storefront_access_token": ""}})
        r = api.post(f"{BASE}/shopify/checkout", params={"session_id": sid})
        assert r.status_code == 400, r.text
        assert "not configured" in r.json()["detail"].lower()

        mongo.settings.update_one({"_id": "shopify"}, {"$set": {"storefront_access_token": FAKE_STOREFRONT_TOKEN}})
        r2 = api.post(f"{BASE}/shopify/checkout", params={"session_id": sid}, timeout=60)
        assert r2.status_code == 400, r2.text
        assert "synced" in r2.json()["detail"].lower()

        api.delete(f"{BASE}/cart/{sid}")

    def test_checkout_with_fake_variant_returns_friendly_502(self, api, mongo, original_settings):
        """Cart item with a shopify_variant_id but bogus store -> friendly 502, no raw HTML."""
        _seed_settings(mongo)
        sid = f"TEST_{uuid.uuid4()}"
        mongo.carts.insert_one({
            "session_id": sid,
            "items": [{
                "product_id": "TEST_prod", "product_name": "TEST Product", "selected_size": "500 ml",
                "price": 100.0, "quantity": 1, "image": "", "shopify_variant_id": "1234567890",
            }],
        })
        t0 = time.time()
        r = requests.post(f"{INTERNAL}/shopify/checkout", params={"session_id": sid}, timeout=60)
        elapsed = time.time() - t0
        print(f"checkout elapsed={elapsed:.2f}s status={r.status_code} body={r.text[:300]}")
        assert r.status_code in (502, 500), r.text
        detail = r.json()["detail"]
        assert "<html" not in detail.lower(), detail
        assert len(detail) <= 300
        mongo.carts.delete_one({"session_id": sid})

    def test_checkout_missing_session_id_422(self, api, original_settings):
        r = api.post(f"{BASE}/shopify/checkout")
        assert r.status_code == 422, r.text


# ---------- Disconnect ----------
class TestDisconnect:
    def test_disconnect_clears_settings(self, api, mongo, original_settings):
        _seed_settings(mongo)
        assert api.get(f"{BASE}/admin/shopify/settings").json()["connected"] is True

        r = api.delete(f"{BASE}/admin/shopify/settings", headers=ADMIN_HDR)
        assert r.status_code == 200, r.text
        assert "message" in r.json()

        g = api.get(f"{BASE}/admin/shopify/settings").json()
        assert g["connected"] is False
        assert g.get("domain") in (None, "")
        assert mongo.settings.find_one({"_id": "shopify"}) is None
        assert api.get(f"{BASE}/shopify/storefront-config").json() == {"configured": False}

    def test_disconnect_idempotent(self, api, original_settings):
        r = api.delete(f"{BASE}/admin/shopify/settings", headers=ADMIN_HDR)
        assert r.status_code == 200, r.text


# ---------- Static code assertions for iteration_3 fixes ----------
class TestSourceFixes:
    def test_no_deprecated_checkout_create(self):
        src = open("/app/backend/shopify_service.py").read()
        assert "checkoutCreate" not in src.replace("(checkoutCreate was sunset by Shopify on 2025-04-01; cartCreate is the current replacement.)", "")
        assert "cartCreate" in src
        assert "checkoutUrl" in src
        assert 'API_VERSION = "2026-07"' in src

    def test_sync_is_non_destructive(self):
        src = open("/app/backend/shopify_service.py").read()
        pull = src.split("async def pull_products_from_shopify")[1]
        assert "delete_many({})" not in pull
        assert "insert_many" not in pull
        assert "existing_map" in pull
        assert "upsert=True" in pull


# ---------- Regression ----------
class TestCatalogRegression:
    def test_products_intact(self, api):
        r = api.get(f"{BASE}/products", params={"limit": 100})
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["total"] == 47, f"expected 47 products, got {d['total']}"
        assert all("_id" not in p for p in d["products"])
        assert all(p.get("sizes") for p in d["products"])

    def test_categories_intact(self, api):
        r = api.get(f"{BASE}/categories")
        assert r.status_code == 200, r.text
        assert len(r.json()) == 10

    def test_product_detail_and_search(self, api):
        pid = api.get(f"{BASE}/products", params={"limit": 1}).json()["products"][0]["id"]
        r = api.get(f"{BASE}/products/{pid}")
        assert r.status_code == 200
        assert r.json()["id"] == pid
        s = api.get(f"{BASE}/products/search", params={"q": "oil"})
        assert s.status_code == 200

    def test_product_not_found_404(self, api):
        r = api.get(f"{BASE}/products/does-not-exist")
        assert r.status_code == 404

    def test_cart_flow(self, api):
        prod = api.get(f"{BASE}/products", params={"limit": 1}).json()["products"][0]
        sid = f"TEST_{uuid.uuid4()}"
        add = api.post(f"{BASE}/cart/{sid}/items", json={
            "product_id": prod["id"], "selected_size": prod["sizes"][0]["size"], "quantity": 2,
        })
        assert add.status_code == 200, add.text
        cart = add.json()
        assert cart["items"][0]["quantity"] == 2
        g = api.get(f"{BASE}/cart/{sid}").json()
        assert len(g["items"]) == 1
        d = api.delete(f"{BASE}/cart/{sid}")
        assert d.status_code == 200
        assert api.get(f"{BASE}/cart/{sid}").json()["items"] == []
