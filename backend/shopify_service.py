import httpx
import re
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

API_VERSION = "2026-07"
SETTINGS_DOC_ID = "shopify"


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug


async def get_settings(db):
    return await db.settings.find_one({"_id": SETTINGS_DOC_ID})


async def save_settings(db, domain: str, admin_access_token: str, storefront_access_token: str | None):
    domain = domain.strip().replace("https://", "").replace("http://", "").strip("/")
    update = {
        "domain": domain,
        "admin_access_token": admin_access_token.strip(),
    }
    if storefront_access_token is not None:
        update["storefront_access_token"] = storefront_access_token.strip()
    await db.settings.update_one(
        {"_id": SETTINGS_DOC_ID},
        {"$set": update},
        upsert=True,
    )
    return await get_settings(db)


def _base_url(settings: dict) -> str:
    return f"https://{settings['domain']}/admin/api/{API_VERSION}"


async def _shopify_request(settings: dict, method: str, path: str, json: dict = None, params: dict = None):
    url = f"{_base_url(settings)}/{path}"
    headers = {
        "X-Shopify-Access-Token": settings["admin_access_token"],
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.request(method, url, headers=headers, json=json, params=params)
    if resp.status_code >= 400:
        raise ShopifyAPIError(resp.status_code, _friendly_error(resp.status_code, resp.text))
    return resp.json() if resp.content else {}


class ShopifyAPIError(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail
        super().__init__(f"Shopify API error {status_code}: {detail}")


def _friendly_error(status_code: int, raw_text: str) -> str:
    if status_code in (401, 403):
        return "Invalid Admin API access token or insufficient scopes."
    if status_code == 404:
        return "Store domain not found. Double-check your *.myshopify.com domain."
    if status_code == 429:
        return "Shopify rate limit reached. Please try again shortly."
    return (raw_text or "Unknown error")[:200]


def _is_valid_image_url(url) -> bool:
    return isinstance(url, str) and url.strip().lower().startswith(("http://", "https://"))


def _product_to_shopify_payload(product: dict) -> dict:
    variants = [
        {
            "option1": size["size"],
            "price": str(size["price"]),
            "sku": f"{product['id']}-{slugify(size['size'])}",
            "inventory_management": "shopify",
        }
        for size in product["sizes"]
    ]
    return {
        "product": {
            "title": product["name"],
            "body_html": product.get("description", ""),
            "vendor": "Shathabdhi Organics",
            "product_type": product.get("category", ""),
            "tags": ", ".join(product.get("benefits", []) + [product.get("origin", "")]),
            "handle": slugify(product["name"]),
            "options": [{"name": "Size"}],
            "variants": variants,
            "images": [{"src": product["image"]}] if _is_valid_image_url(product.get("image")) else [],
        }
    }


async def _fetch_all_shopify_products(settings: dict) -> list:
    all_products = []
    params = {"limit": 250}
    while True:
        result = await _shopify_request(settings, "GET", "products.json", params=params)
        batch = result.get("products", [])
        all_products.extend(batch)
        if len(batch) < 250:
            break
        params = {"limit": 250, "since_id": batch[-1]["id"]}
    return all_products


async def push_products_to_shopify(db, settings: dict, product_ids: list = None) -> dict:
    """Create or update each local product in Shopify, matched by its own existing shopify_product_id
    first, then by handle, then by exact title (only when the title is unambiguous in the Shopify
    catalog) - avoids two local records ever resolving to the same Shopify product.
    Pass product_ids to scope the push to specific local products only (e.g. a test batch)."""
    await _shopify_request(settings, "GET", "shop.json")

    query = {"id": {"$in": product_ids}} if product_ids else {}
    products = await db.products.find(query).to_list(length=1000)
    existing_products = await _fetch_all_shopify_products(settings)
    by_id = {str(sp["id"]): sp for sp in existing_products}
    by_handle = {sp["handle"]: sp for sp in existing_products}

    title_counts = {}
    for sp in existing_products:
        key = sp["title"].strip().lower()
        title_counts[key] = title_counts.get(key, 0) + 1
    by_title = {
        sp["title"].strip().lower(): sp
        for sp in existing_products
        if title_counts[sp["title"].strip().lower()] == 1
    }

    used_shopify_ids = set()
    created, updated, failed, skipped_images = 0, 0, [], []

    for product in products:
        product.pop("_id", None)
        handle = slugify(product["name"])
        try:
            if not _is_valid_image_url(product.get("image")):
                skipped_images.append(product.get("name"))

            payload = _product_to_shopify_payload(product)
            match = (
                by_id.get(product.get("shopify_product_id"))
                or by_handle.get(handle)
                or by_title.get(product["name"].strip().lower())
            )
            if match and str(match["id"]) in used_shopify_ids:
                match = None  # already claimed by another local product this run - create a new one instead

            if match:
                used_shopify_ids.add(str(match["id"]))
                result = await _shopify_request(settings, "PUT", f"products/{match['id']}.json", json=payload)
                updated += 1
            else:
                result = await _shopify_request(settings, "POST", "products.json", json=payload)
                used_shopify_ids.add(str(result["product"]["id"]))
                created += 1

            sp = result["product"]
            variant_map = {v.get("option1"): str(v["id"]) for v in sp.get("variants", [])}
            updated_sizes = [
                {**{k: v for k, v in size.items() if k != "_id"}, "shopify_variant_id": variant_map.get(size["size"])}
                for size in product["sizes"]
            ]
            await db.products.update_one(
                {"id": product["id"]},
                {"$set": {
                    "shopify_product_id": str(sp["id"]),
                    "shopify_variant_id": str(sp["variants"][0]["id"]) if sp.get("variants") else None,
                    "sizes": updated_sizes,
                }},
            )
        except Exception as e:
            logger.error(f"Failed to push product {product.get('name')}: {e}")
            failed.append(product.get("name"))

    await db.settings.update_one(
        {"_id": SETTINGS_DOC_ID},
        {"$set": {"last_pushed_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {
        "created": created,
        "updated": updated,
        "failed": failed,
        "total": len(products),
        "skipped_images": skipped_images,
    }


def _shopify_product_to_local(sp: dict, existing: dict = None) -> dict:
    import uuid

    variants = sp.get("variants", [])
    sizes = [
        {
            "size": v.get("option1") or v.get("title", "Default"),
            "price": float(v.get("price", 0)),
            "shopify_variant_id": str(v["id"]),
        }
        for v in variants
    ]
    base_price = sizes[0]["price"] if sizes else 0.0
    images = sp.get("images", [])
    fetched_image = images[0]["src"] if images else (sp.get("image", {}) or {}).get("src", "")
    image = fetched_image or (existing.get("image", "") if existing else "")
    tags = [t.strip() for t in (sp.get("tags") or "").split(",") if t.strip()]

    # Preserve curated local fields (category/origin/profile/badge) when Shopify has no equivalent data,
    # so an existing product doesn't lose its storefront category/navigation on sync.
    category = sp.get("product_type") or (existing.get("category") if existing else None) or "Uncategorized"
    origin = existing.get("origin", "") if existing else ""
    profile = existing.get("profile", "") if existing else ""
    badge = existing.get("badge") if existing else None

    return {
        "id": existing["id"] if existing else str(uuid.uuid4()),
        "name": sp["title"],
        "category": category,
        "type": "Shopify",
        "description": re.sub("<[^<]+?>", "", sp.get("body_html") or ""),
        "profile": profile,
        "base_price": base_price,
        "sizes": sizes or [{"size": "Default", "price": 0.0}],
        "image": image,
        "badge": badge,
        "benefits": tags,
        "origin": origin,
        "shopify_product_id": str(sp["id"]),
        "shopify_variant_id": str(variants[0]["id"]) if variants else None,
        "updated_at": datetime.now(timezone.utc),
    }


async def create_storefront_checkout(settings: dict, line_items: list) -> str:
    """Create a Shopify cart via the Storefront GraphQL Cart API and return its checkoutUrl.
    (checkoutCreate was sunset by Shopify on 2025-04-01; cartCreate is the current replacement.)"""
    if not settings.get("storefront_access_token"):
        raise ShopifyAPIError(400, "Storefront access token not configured")

    url = f"https://{settings['domain']}/api/{API_VERSION}/graphql.json"
    headers = {
        "X-Shopify-Storefront-Access-Token": settings["storefront_access_token"],
        "Content-Type": "application/json",
    }
    query = """
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { id checkoutUrl }
        userErrors { message field }
      }
    }
    """
    cart_lines = [
        {"merchandiseId": f"gid://shopify/ProductVariant/{li['variant_id']}", "quantity": li["quantity"]}
        for li in line_items
    ]
    variables = {"input": {"lines": cart_lines}}

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(url, headers=headers, json={"query": query, "variables": variables})

    if resp.status_code >= 400:
        raise ShopifyAPIError(resp.status_code, _friendly_error(resp.status_code, resp.text))

    data = resp.json()
    result = data.get("data", {}).get("cartCreate") or {}
    errors = result.get("userErrors") or []
    if errors:
        raise ShopifyAPIError(400, "; ".join(e.get("message", "") for e in errors))

    cart = result.get("cart")
    if not cart:
        raise ShopifyAPIError(502, "Shopify did not return a cart. Check your Storefront Access Token.")
    return cart["checkoutUrl"]


async def pull_products_from_shopify(db, settings: dict) -> dict:
    """Fetch the full Shopify catalog and upsert it locally (Shopify becomes source of truth),
    preserving existing local ids/cart references and only removing products deleted upstream."""
    await _shopify_request(settings, "GET", "shop.json")

    all_products = await _fetch_all_shopify_products(settings)

    existing_docs = await db.products.find({"shopify_product_id": {"$ne": None}}).to_list(length=10000)
    existing_map = {d["shopify_product_id"]: d for d in existing_docs if d.get("shopify_product_id")}

    fetched_ids = set()
    skipped = []
    for sp in all_products:
        try:
            shopify_id = str(sp["id"])
            fetched_ids.add(shopify_id)
            doc = _shopify_product_to_local(sp, existing=existing_map.get(shopify_id))
            await db.products.update_one(
                {"shopify_product_id": shopify_id},
                {"$set": doc, "$setOnInsert": {"created_at": datetime.now(timezone.utc)}},
                upsert=True,
            )
        except Exception as e:
            logger.error(f"Failed to sync product {sp.get('title', sp.get('id'))}: {e}")
            skipped.append(sp.get("title", str(sp.get("id"))))

    removed_ids = set(existing_map.keys()) - fetched_ids
    if removed_ids:
        await db.products.delete_many({"shopify_product_id": {"$in": list(removed_ids)}})

    await db.settings.update_one(
        {"_id": SETTINGS_DOC_ID},
        {"$set": {"last_synced_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"synced": len(fetched_ids), "removed": len(removed_ids), "skipped": skipped}
