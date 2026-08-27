"""Regression suite for Shathabdhi Organics API (post merge-conflict-fix)."""
import os
import uuid

import pytest
import requests
from dotenv import dotenv_values

_env = dotenv_values("/app/frontend/.env")
BASE = (os.environ.get("REACT_APP_BACKEND_URL") or _env.get("REACT_APP_BACKEND_URL") or "").rstrip("/")
if not BASE:
    raise RuntimeError("REACT_APP_BACKEND_URL missing")
API = f"{BASE}/api"

ALL_CATEGORIES = {
    "Millets": 8,
    "Spices & Powders": 6,
    "Rices": 4,
    "Oils": 5,
    "Processed Products": 4,
    "Dals": 4,
    "Cookies": 4,
    "Snacks & Bars": 5,
    "Sweets & Treats": 4,
    "Health Drinks": 3,
}
TOTAL_PRODUCTS = 47


# ---------- root / health ----------
def test_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    assert "Shathabdhi" in r.json()["message"]


# ---------- categories ----------
def test_categories_all_ten():
    r = requests.get(f"{API}/categories")
    assert r.status_code == 200
    data = r.json()
    names = [c["name"] for c in data]
    assert len(data) == 10, names
    for n in ALL_CATEGORIES:
        assert n in names
    for c in data:
        assert "_id" not in c


# ---------- products ----------
def test_products_paginated():
    r = requests.get(f"{API}/products?per_page=5&page=1")
    assert r.status_code == 200
    d = r.json()
    assert d["total"] == TOTAL_PRODUCTS
    assert len(d["products"]) == 5
    assert d["page"] == 1 and d["per_page"] == 5
    assert all("_id" not in p for p in d["products"])


def test_products_all_47_fetchable():
    r = requests.get(f"{API}/products?per_page=100")
    assert r.status_code == 200
    assert len(r.json()["products"]) == TOTAL_PRODUCTS


@pytest.mark.parametrize("cat,count", list(ALL_CATEGORIES.items()))
def test_products_filter_category(cat, count):
    r = requests.get(f"{API}/products", params={"category": cat, "per_page": 100})
    assert r.status_code == 200
    d = r.json()
    assert d["total"] == count
    for p in d["products"]:
        assert p["category"] == cat
        assert isinstance(p["sizes"], list) and len(p["sizes"]) > 0
        assert p["image"]


def test_products_sort_price_low():
    prices = [p["base_price"] for p in requests.get(f"{API}/products?sort_by=price-low&per_page=100").json()["products"]]
    assert prices == sorted(prices)


def test_products_sort_name_az():
    names = [p["name"] for p in requests.get(f"{API}/products?sort_by=name-az&per_page=100").json()["products"]]
    assert names == sorted(names)


def test_products_filter_type():
    r = requests.get(f"{API}/products?type=Cold Pressed&per_page=100")
    assert r.status_code == 200
    assert r.json()["total"] > 0
    for p in r.json()["products"]:
        assert p["type"] == "Cold Pressed"


def test_products_filter_benefits():
    r = requests.get(f"{API}/products?benefits=Gluten-Free&per_page=100")
    assert r.status_code == 200
    assert r.json()["total"] > 0
    for p in r.json()["products"]:
        assert "Gluten-Free" in p["benefits"]


def test_products_invalid_page_validation():
    assert requests.get(f"{API}/products?page=0").status_code == 422
    assert requests.get(f"{API}/products?per_page=500").status_code == 422


# ---------- product detail ----------
@pytest.mark.parametrize("pid", ["m1", "s1", "r1", "o1", "d1", "c1", "p1"])
def test_get_product_by_id(pid):
    r = requests.get(f"{API}/products/{pid}")
    assert r.status_code == 200
    d = r.json()
    assert d["id"] == pid
    assert d["name"]
    assert len(d["sizes"]) > 0


def test_get_new_category_products_by_id():
    """Products from the 3 categories restored by the merge-conflict fix."""
    for pid in ["sb1", "st1", "hd1"]:
        r = requests.get(f"{API}/products/{pid}")
        assert r.status_code == 200, f"{pid} -> {r.status_code} {r.text[:200]}"


def test_get_product_404():
    assert requests.get(f"{API}/products/nonexistent").status_code == 404


# ---------- search ----------
def test_search_millet():
    r = requests.get(f"{API}/products/search", params={"q": "millet"})
    assert r.status_code == 200
    d = r.json()
    assert d["query"] == "millet"
    assert d["total"] > 0
    assert len(d["results"]) > 0
    for p in d["results"]:
        assert "_id" not in p
        assert p["id"] and p["name"]


@pytest.mark.parametrize("q", ["ragi", "turmeric", "oil", "cookies", "Cold Pressed"])
def test_search_various_terms(q):
    r = requests.get(f"{API}/products/search", params={"q": q})
    assert r.status_code == 200
    assert r.json()["total"] > 0, f"no results for {q}"


def test_search_empty_query():
    r = requests.get(f"{API}/products/search", params={"q": ""})
    assert r.status_code == 200
    assert r.json()["results"] == [] and r.json()["total"] == 0


def test_search_no_match():
    r = requests.get(f"{API}/products/search", params={"q": "zzzqqqxyz"})
    assert r.status_code == 200
    assert r.json()["total"] == 0


def test_search_limit_respected():
    r = requests.get(f"{API}/products/search", params={"q": "organic", "limit": 3})
    assert r.status_code == 200
    assert len(r.json()["results"]) <= 3


def test_search_route_not_shadowed_by_product_id():
    """/products/search must not be resolved as /products/{product_id}."""
    r = requests.get(f"{API}/products/search?q=millet")
    assert r.status_code == 200
    assert "results" in r.json()


# ---------- testimonials ----------
def test_testimonials():
    r = requests.get(f"{API}/testimonials")
    assert r.status_code == 200
    assert len(r.json()) > 0


def test_testimonials_featured():
    r = requests.get(f"{API}/testimonials?is_featured=true")
    assert r.status_code == 200
    for t in r.json():
        assert t["is_featured"] is True


# ---------- cart ----------
@pytest.fixture
def sid():
    s = f"TEST_{uuid.uuid4().hex[:8]}"
    yield s
    requests.delete(f"{API}/cart/{s}")


def test_cart_full_flow(sid):
    r = requests.get(f"{API}/cart/{sid}")
    assert r.status_code == 200
    assert r.json()["items"] == [] and r.json()["session_id"] == sid

    r = requests.post(f"{API}/cart/{sid}/items", json={"product_id": "m1", "selected_size": "500 g", "quantity": 2})
    assert r.status_code == 200
    c = r.json()
    assert len(c["items"]) == 1
    assert c["items"][0]["product_id"] == "m1"
    assert c["items"][0]["quantity"] == 2
    assert c["total"] == c["items"][0]["price"] * 2

    # persisted
    assert requests.get(f"{API}/cart/{sid}").json()["items"][0]["quantity"] == 2

    # same product+size increments
    r = requests.post(f"{API}/cart/{sid}/items", json={"product_id": "m1", "selected_size": "500 g", "quantity": 1})
    assert r.json()["items"][0]["quantity"] == 3
    assert len(r.json()["items"]) == 1

    # update
    r = requests.put(f"{API}/cart/{sid}/items/m1?selected_size=500 g", json={"quantity": 5})
    assert r.status_code == 200
    assert requests.get(f"{API}/cart/{sid}").json()["items"][0]["quantity"] == 5

    # remove
    r = requests.delete(f"{API}/cart/{sid}/items/m1?selected_size=500 g")
    assert r.status_code == 200
    assert r.json()["items"] == []
    assert requests.get(f"{API}/cart/{sid}").json()["total"] == 0


def test_cart_clear(sid):
    requests.post(f"{API}/cart/{sid}/items", json={"product_id": "s1", "selected_size": "100 g", "quantity": 1})
    r = requests.delete(f"{API}/cart/{sid}")
    assert r.status_code == 200
    assert requests.get(f"{API}/cart/{sid}").json()["items"] == []


def test_cart_invalid_product(sid):
    r = requests.post(f"{API}/cart/{sid}/items", json={"product_id": "BAD", "selected_size": "500 g", "quantity": 1})
    assert r.status_code == 404


def test_cart_invalid_size(sid):
    r = requests.post(f"{API}/cart/{sid}/items", json={"product_id": "m1", "selected_size": "9999 g", "quantity": 1})
    assert r.status_code == 400


def test_cart_update_nonexistent_item(sid):
    requests.get(f"{API}/cart/{sid}")
    r = requests.put(f"{API}/cart/{sid}/items/m1?selected_size=500 g", json={"quantity": 2})
    assert r.status_code == 404


def test_cart_clear_nonexistent():
    r = requests.delete(f"{API}/cart/TEST_does_not_exist_{uuid.uuid4().hex[:6]}")
    assert r.status_code == 404
