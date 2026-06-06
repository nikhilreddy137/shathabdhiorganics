import os, uuid, requests, pytest

BASE = os.environ.get('REACT_APP_BACKEND_URL', 'https://access-build.preview.emergentagent.com').rstrip('/')
API = f"{BASE}/api"

def test_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200

def test_categories():
    r = requests.get(f"{API}/categories")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 7
    names = [c["name"] for c in data]
    for n in ["Millets","Spices & Powders","Rices","Oils","Processed Products","Dals","Cookies"]:
        assert n in names

def test_products_paginated():
    r = requests.get(f"{API}/products?per_page=5&page=1")
    assert r.status_code == 200
    d = r.json()
    assert "products" in d and "total" in d
    assert d["total"] >= 28
    assert len(d["products"]) == 5

@pytest.mark.parametrize("cat", ["Millets","Spices & Powders","Rices","Oils","Dals","Cookies","Processed Products"])
def test_products_filter_category(cat):
    r = requests.get(f"{API}/products", params={"category": cat, "per_page": 100})
    assert r.status_code == 200
    d = r.json()
    assert d["total"] > 0
    for p in d["products"]:
        assert p["category"] == cat

def test_products_sort_price_low():
    r = requests.get(f"{API}/products?sort_by=price-low&per_page=100")
    d = r.json()["products"]
    prices = [p["base_price"] for p in d]
    assert prices == sorted(prices)

def test_products_filter_type():
    r = requests.get(f"{API}/products?type=Cold Pressed")
    assert r.status_code == 200
    for p in r.json()["products"]:
        assert p["type"] == "Cold Pressed"

def test_products_filter_benefits():
    r = requests.get(f"{API}/products?benefits=Gluten-Free")
    assert r.status_code == 200
    for p in r.json()["products"]:
        assert "Gluten-Free" in p["benefits"]

def test_get_product_by_id():
    r = requests.get(f"{API}/products/m1")
    assert r.status_code == 200
    assert r.json()["name"].startswith("Foxtail")

def test_get_product_404():
    r = requests.get(f"{API}/products/nonexistent")
    assert r.status_code == 404

def test_testimonials():
    r = requests.get(f"{API}/testimonials")
    assert r.status_code == 200
    assert len(r.json()) == 4

def test_testimonials_featured():
    r = requests.get(f"{API}/testimonials?is_featured=true")
    assert r.status_code == 200
    for t in r.json():
        assert t["is_featured"] is True

@pytest.fixture
def sid():
    return f"TEST_{uuid.uuid4().hex[:8]}"

def test_cart_flow(sid):
    # GET creates empty
    r = requests.get(f"{API}/cart/{sid}")
    assert r.status_code == 200
    assert r.json()["items"] == []
    # Add item
    r = requests.post(f"{API}/cart/{sid}/items", json={"product_id": "m1", "selected_size": "500 g", "quantity": 2})
    assert r.status_code == 200
    c = r.json()
    assert len(c["items"]) == 1
    assert c["items"][0]["quantity"] == 2
    assert c["total"] == 120.0
    # Update qty
    r = requests.put(f"{API}/cart/{sid}/items/m1?selected_size=500 g", json={"quantity": 3})
    assert r.status_code == 200
    assert r.json()["items"][0]["quantity"] == 3
    # GET persisted
    r = requests.get(f"{API}/cart/{sid}")
    assert r.json()["items"][0]["quantity"] == 3
    # Remove
    r = requests.delete(f"{API}/cart/{sid}/items/m1?selected_size=500 g")
    assert r.status_code == 200
    assert r.json()["items"] == []
    # Add then clear
    requests.post(f"{API}/cart/{sid}/items", json={"product_id": "s1", "selected_size": "100 g", "quantity": 1})
    r = requests.delete(f"{API}/cart/{sid}")
    assert r.status_code == 200

def test_cart_invalid_product(sid):
    r = requests.post(f"{API}/cart/{sid}/items", json={"product_id": "BAD", "selected_size": "500 g", "quantity": 1})
    assert r.status_code == 404

def test_cart_invalid_size(sid):
    r = requests.post(f"{API}/cart/{sid}/items", json={"product_id": "m1", "selected_size": "9999 g", "quantity": 1})
    assert r.status_code == 400
