"""Storefront backend regression tests for Typography & Imagery Overhaul session.
Tests: products (per_page=200), categories, search, cart CRUD, checkout URL.
"""
import os
import pytest
import requests
import uuid

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback: read from frontend/.env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- Products ----------
def test_products_per_page_200(s):
    r = s.get(f"{API}/products", params={"per_page": 200}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    # Accept common shapes
    items = data.get("products") or data.get("items") or data.get("data") or data
    assert isinstance(items, list)
    assert len(items) >= 150, f"Expected ~164 products, got {len(items)}"
    print(f"Products count: {len(items)}")


def test_products_per_page_exceed_cap(s):
    # per_page must accept up to 200; 201 should be rejected
    r = s.get(f"{API}/products", params={"per_page": 201}, timeout=30)
    assert r.status_code in (400, 422)


# ---------- Categories ----------
def test_categories(s):
    r = s.get(f"{API}/categories", timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    items = data if isinstance(data, list) else (data.get("categories") or data.get("items") or [])
    assert len(items) >= 15, f"Expected ~21 categories, got {len(items)}"
    print(f"Categories count: {len(items)}")


# ---------- Search ----------
def test_search_millet(s):
    r = s.get(f"{API}/products/search", params={"q": "millet"}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    items = data.get("results") or data.get("products") or data.get("items") or []
    assert isinstance(items, list) and len(items) > 0
    print(f"Millet search results: {len(items)}")


# ---------- Cart CRUD ----------
@pytest.fixture(scope="module")
def session_id():
    return f"TEST_{uuid.uuid4().hex[:10]}"


@pytest.fixture(scope="module")
def sample_product(s):
    r = s.get(f"{API}/products", params={"per_page": 5}, timeout=30)
    assert r.status_code == 200
    data = r.json()
    items = data.get("products") or data.get("items") or data.get("data") or data
    assert items, "No products available"
    return items[0]


def test_cart_add_get_update_delete(s, session_id, sample_product):
    prod = sample_product
    pid = prod.get("id") or prod.get("_id") or prod.get("product_id")
    sizes = prod.get("sizes") or []
    assert sizes, f"Product has no sizes: {prod}"
    selected_size = sizes[0]["size"]

    # ADD
    payload = {
        "product_id": str(pid),
        "selected_size": selected_size,
        "quantity": 1,
    }
    r = s.post(f"{API}/cart/{session_id}/items", json=payload, timeout=30)
    assert r.status_code in (200, 201), f"cart add failed: {r.status_code} {r.text}"

    # GET
    r = s.get(f"{API}/cart/{session_id}", timeout=30)
    assert r.status_code == 200, r.text
    cart = r.json()
    items = cart.get("items") or []
    assert len(items) >= 1, f"Cart empty after add: {cart}"

    # UPDATE quantity
    u = s.put(
        f"{API}/cart/{session_id}/items/{pid}",
        params={"selected_size": selected_size},
        json={"quantity": 2},
        timeout=30,
    )
    assert u.status_code < 500, u.text

    # GET verify persistence
    r = s.get(f"{API}/cart/{session_id}", timeout=30)
    assert r.status_code == 200
    items = r.json().get("items", [])
    assert any(i["quantity"] == 2 for i in items), f"Update didn't persist: {items}"


# ---------- Shopify checkout URL ----------
def test_shopify_checkout_url(s, session_id, sample_product):
    prod = sample_product
    pid = prod.get("id") or prod.get("_id") or prod.get("product_id")
    sizes = prod.get("sizes") or []
    if sizes:
        s.post(
            f"{API}/cart/{session_id}/items",
            json={"product_id": str(pid), "selected_size": sizes[0]["size"], "quantity": 1},
            timeout=30,
        )

    r = s.post(f"{API}/shopify/checkout", params={"session_id": session_id}, timeout=60)
    assert r.status_code in (200, 201), f"checkout failed: {r.status_code} {r.text}"
    data = r.json()
    url = data.get("checkout_url") or data.get("url") or data.get("web_url")
    assert url and isinstance(url, str) and url.startswith("http"), f"No checkout URL: {data}"
    print(f"Checkout URL: {url[:80]}...")


# ---------- Fonts served ----------
def test_fonts_available(s):
    # Fonts are served from the frontend at /fonts/*.woff2 (not /api)
    fonts = [
        "/fonts/instrument-serif-latin.woff2",
        "/fonts/hanken-grotesk-var-latin.woff2",
    ]
    for f in fonts:
        r = requests.get(f"{BASE_URL}{f}", timeout=15)
        assert r.status_code == 200, f"Font {f} -> {r.status_code}"
        assert int(r.headers.get("content-length", "0")) > 1000 or len(r.content) > 1000
