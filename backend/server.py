from fastapi import FastAPI, APIRouter, HTTPException, Query, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import asyncio
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from models import (
    Product, ProductCreate, Category, Cart, CartItem, 
    AddCartItem, UpdateCartItem, Testimonial, PaginatedProducts,
    ShopifySettingsInput, ShopifySettingsStatus
)
from seed_data import products_seed, categories_seed, testimonials_seed
import shopify_service
import object_storage
from fastapi import Response

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Products hidden from the storefront (removed on request, kept in Shopify sync)
EXCLUDED_PRODUCT_NAMES = [
    "Amla Pickle in Cold Pressed Oil (250g)",
]


async def verify_admin_key(x_admin_key: Optional[str] = Header(None)):
    admin_key = os.environ.get("ADMIN_PANEL_KEY")
    if not admin_key or not x_admin_key or not secrets.compare_digest(x_admin_key, admin_key):
        raise HTTPException(status_code=401, detail="Invalid or missing admin key")


# ===================== SEED DATABASE =====================
@api_router.post("/analytics/events")
async def track_event(payload: dict):
    payload["received_at"] = datetime.now(timezone.utc).isoformat()
    await db.analytics_events.insert_one(dict(payload))
    return {"ok": True}


@api_router.post("/seed")
async def seed_database():
    """Seed the database with initial data"""
    try:
        # Clear existing data
        await db.products.delete_many({})
        await db.categories.delete_many({})
        await db.testimonials.delete_many({})
        
        # Insert seed data
        if products_seed:
            await db.products.insert_many(products_seed)
        if categories_seed:
            await db.categories.insert_many(categories_seed)
        if testimonials_seed:
            await db.testimonials.insert_many(testimonials_seed)
        
        return {
            "message": "Database seeded successfully",
            "products": len(products_seed),
            "categories": len(categories_seed),
            "testimonials": len(testimonials_seed)
        }
    except Exception as e:
        logger.error(f"Error seeding database: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ===================== PRODUCTS API =====================
@api_router.get("/products", response_model=PaginatedProducts)
async def get_products(
    category: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    benefits: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("featured"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=200)
):
    """Get all products with filtering, sorting, and pagination"""
    try:
        # Build filter query (exclude Shopify billing/app-managed products and photo-less products from the storefront)
        query = {
            "category": {"$ne": "Subscription Management"},
            "image": {"$ne": ""},
            "name": {"$nin": EXCLUDED_PRODUCT_NAMES},
        }
        
        if category:
            query["category"] = category if category != "Subscription Management" else {"$in": []}
        
        if type:
            query["type"] = type
        
        if benefits:
            # Benefits can be comma-separated
            benefit_list = [b.strip() for b in benefits.split(",")]
            query["benefits"] = {"$in": benefit_list}
        
        # Count total documents
        total = await db.products.count_documents(query)
        
        # Build sort
        sort_field = "created_at"
        sort_order = -1
        
        if sort_by == "price-low":
            sort_field = "base_price"
            sort_order = 1
        elif sort_by == "price-high":
            sort_field = "base_price"
            sort_order = -1
        elif sort_by == "name-az":
            sort_field = "name"
            sort_order = 1
        elif sort_by == "name-za":
            sort_field = "name"
            sort_order = -1
        
        # Calculate skip
        skip = (page - 1) * per_page
        
        # Fetch products
        cursor = db.products.find(query).sort(sort_field, sort_order).skip(skip).limit(per_page)
        products = await cursor.to_list(length=per_page)
        
        # Remove MongoDB _id field
        for product in products:
            product.pop("_id", None)
        
        return {
            "products": products,
            "total": total,
            "page": page,
            "per_page": per_page
        }
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/products/search")
async def search_products(
    q: str = Query("", description="Search query"),
    limit: int = Query(20, ge=1, le=50)
):
    """Search products by name, description, profile, category, type, benefits, or origin."""
    try:
        q = (q or "").strip()
        if not q:
            return {"query": q, "results": [], "total": 0}

        # Case-insensitive regex against multiple fields
        regex = {"$regex": q, "$options": "i"}
        query = {
            "category": {"$ne": "Subscription Management"},
            "image": {"$ne": ""},
            "name": {"$nin": EXCLUDED_PRODUCT_NAMES},
            "$or": [
                {"name": regex},
                {"description": regex},
                {"profile": regex},
                {"category": regex},
                {"type": regex},
                {"origin": regex},
                {"benefits": regex},
            ]
        }
        total = await db.products.count_documents(query)
        cursor = db.products.find(query).limit(limit)
        results = await cursor.to_list(length=limit)
        for p in results:
            p.pop("_id", None)
        return {"query": q, "results": results, "total": total}
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a single product by ID"""
    try:
        product = await db.products.find_one({"id": product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        product.pop("_id", None)
        return product
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product"""
    try:
        product_dict = product.dict()
        product_obj = Product(**product_dict)

        insert_dict = product_obj.dict()
        if insert_dict.get("shopify_product_id") is None:
            insert_dict.pop("shopify_product_id", None)  # sparse index excludes only omitted fields, not explicit nulls

        await db.products.insert_one(insert_dict)
        return product_obj
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ===================== CATEGORIES API =====================
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    try:
        cursor = db.categories.find().sort("display_order", 1)
        categories = await cursor.to_list(length=100)
        
        for category in categories:
            category.pop("_id", None)
        
        return categories
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ===================== CART API =====================
@api_router.get("/cart/{session_id}", response_model=Cart)
async def get_cart(session_id: str):
    """Get cart for a session"""
    try:
        cart = await db.carts.find_one({"session_id": session_id})
        
        if not cart:
            # Create new cart if doesn't exist
            new_cart = Cart(session_id=session_id)
            await db.carts.insert_one(new_cart.dict())
            return new_cart
        
        cart.pop("_id", None)
        return cart
    except Exception as e:
        logger.error(f"Error fetching cart: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/cart/{session_id}/items", response_model=Cart)
async def add_to_cart(session_id: str, item_data: AddCartItem):
    """Add item to cart"""
    try:
        # Get product details
        product = await db.products.find_one({"id": item_data.product_id})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Find the selected size price
        selected_size_obj = next(
            (s for s in product["sizes"] if s["size"] == item_data.selected_size),
            None
        )
        
        if not selected_size_obj:
            raise HTTPException(status_code=400, detail="Invalid size selected")
        
        # Get or create cart
        cart = await db.carts.find_one({"session_id": session_id})
        
        if not cart:
            cart = Cart(session_id=session_id).dict()
            cart["items"] = []
        
        # Check if item already exists in cart
        existing_item_index = None
        for idx, cart_item in enumerate(cart["items"]):
            if (cart_item["product_id"] == item_data.product_id and 
                cart_item["selected_size"] == item_data.selected_size):
                existing_item_index = idx
                break
        
        if existing_item_index is not None:
            # Update quantity
            cart["items"][existing_item_index]["quantity"] += item_data.quantity
        else:
            # Add new item
            new_item = CartItem(
                product_id=item_data.product_id,
                product_name=product["name"],
                selected_size=item_data.selected_size,
                price=selected_size_obj["price"],
                quantity=item_data.quantity,
                image=product["image"],
                shopify_variant_id=selected_size_obj.get("shopify_variant_id"),
            )
            cart["items"].append(new_item.dict())
        
        # Calculate total
        cart["total"] = sum(item["price"] * item["quantity"] for item in cart["items"])
        cart["updated_at"] = datetime.utcnow()
        
        # Update database
        await db.carts.update_one(
            {"session_id": session_id},
            {"$set": cart},
            upsert=True
        )
        
        cart.pop("_id", None)
        return cart
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding to cart: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/cart/{session_id}/items/{product_id}", response_model=Cart)
async def remove_from_cart(session_id: str, product_id: str, selected_size: str = Query(...)):
    """Remove item from cart"""
    try:
        cart = await db.carts.find_one({"session_id": session_id})
        
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Remove item
        cart["items"] = [
            item for item in cart["items"]
            if not (item["product_id"] == product_id and item["selected_size"] == selected_size)
        ]
        
        # Recalculate total
        cart["total"] = sum(item["price"] * item["quantity"] for item in cart["items"])
        cart["updated_at"] = datetime.utcnow()
        
        # Update database
        await db.carts.update_one(
            {"session_id": session_id},
            {"$set": cart}
        )
        
        cart.pop("_id", None)
        return cart
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error removing from cart: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.put("/cart/{session_id}/items/{product_id}", response_model=Cart)
async def update_cart_item(
    session_id: str, 
    product_id: str, 
    update_data: UpdateCartItem,
    selected_size: str = Query(...)
):
    """Update cart item quantity"""
    try:
        cart = await db.carts.find_one({"session_id": session_id})
        
        if not cart:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        # Find and update item
        item_found = False
        for item in cart["items"]:
            if item["product_id"] == product_id and item["selected_size"] == selected_size:
                item["quantity"] = update_data.quantity
                item_found = True
                break
        
        if not item_found:
            raise HTTPException(status_code=404, detail="Item not found in cart")
        
        # Recalculate total
        cart["total"] = sum(item["price"] * item["quantity"] for item in cart["items"])
        cart["updated_at"] = datetime.utcnow()
        
        # Update database
        await db.carts.update_one(
            {"session_id": session_id},
            {"$set": cart}
        )
        
        cart.pop("_id", None)
        return cart
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating cart item: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/cart/{session_id}")
async def clear_cart(session_id: str):
    """Clear all items from cart"""
    try:
        result = await db.carts.delete_one({"session_id": session_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Cart not found")
        
        return {"message": "Cart cleared successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error clearing cart: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ===================== TESTIMONIALS API =====================
@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(
    is_featured: Optional[bool] = Query(None),
    limit: int = Query(10, ge=1, le=100)
):
    """Get testimonials"""
    try:
        query = {}
        if is_featured is not None:
            query["is_featured"] = is_featured
        
        cursor = db.testimonials.find(query).limit(limit)
        testimonials = await cursor.to_list(length=limit)
        
        for testimonial in testimonials:
            testimonial.pop("_id", None)
        
        return testimonials
    except Exception as e:
        logger.error(f"Error fetching testimonials: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/images/{path:path}")
async def get_product_image(path: str):
    """Public, unauthenticated image serving for product images (needs to be fetchable by
    <img> tags and by Shopify's servers when we push product images to Shopify)."""
    try:
        data, content_type = object_storage.get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=data, media_type=content_type)


# ===================== SHOPIFY INTEGRATION =====================
@api_router.get("/admin/shopify/settings", response_model=ShopifySettingsStatus)
async def get_shopify_settings():
    """Get masked Shopify connection status (never returns raw tokens)"""
    settings = await shopify_service.get_settings(db)
    if not settings:
        return ShopifySettingsStatus(connected=False)
    return ShopifySettingsStatus(
        connected=bool(settings.get("domain") and settings.get("admin_access_token")),
        domain=settings.get("domain"),
        has_admin_token=bool(settings.get("admin_access_token")),
        has_storefront_token=bool(settings.get("storefront_access_token")),
        last_synced_at=settings.get("last_synced_at"),
        last_pushed_at=settings.get("last_pushed_at"),
    )


@api_router.post("/admin/shopify/settings", response_model=ShopifySettingsStatus, dependencies=[Depends(verify_admin_key)])
async def save_shopify_settings(payload: ShopifySettingsInput):
    """Save Shopify store domain + Admin/Storefront API tokens"""
    try:
        settings = await shopify_service.save_settings(
            db, payload.domain, payload.admin_access_token, payload.storefront_access_token
        )
        return ShopifySettingsStatus(
            connected=True,
            domain=settings.get("domain"),
            has_admin_token=bool(settings.get("admin_access_token")),
            has_storefront_token=bool(settings.get("storefront_access_token")),
            last_synced_at=settings.get("last_synced_at"),
            last_pushed_at=settings.get("last_pushed_at"),
        )
    except Exception as e:
        logger.error(f"Error saving Shopify settings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/admin/shopify/settings", dependencies=[Depends(verify_admin_key)])
async def disconnect_shopify():
    """Disconnect the Shopify store and clear stored credentials"""
    await db.settings.delete_one({"_id": "shopify"})
    return {"message": "Shopify disconnected"}


shopify_jobs = {"push": {"status": "idle"}, "sync": {"status": "idle"}}


async def _run_push_job():
    shopify_jobs["push"] = {"status": "running", "started_at": datetime.now(timezone.utc).isoformat()}
    try:
        settings = await shopify_service.get_settings(db)
        result = await shopify_service.push_products_to_shopify(db, settings)
        shopify_jobs["push"] = {"status": "done", "result": result, "finished_at": datetime.now(timezone.utc).isoformat()}
    except shopify_service.ShopifyAPIError as e:
        shopify_jobs["push"] = {"status": "error", "error": e.detail}
    except Exception as e:
        logger.error(f"Push job failed: {str(e)}")
        shopify_jobs["push"] = {"status": "error", "error": str(e)}


async def _run_sync_job():
    shopify_jobs["sync"] = {"status": "running", "started_at": datetime.now(timezone.utc).isoformat()}
    try:
        settings = await shopify_service.get_settings(db)
        result = await shopify_service.pull_products_from_shopify(db, settings)
        shopify_jobs["sync"] = {"status": "done", "result": result, "finished_at": datetime.now(timezone.utc).isoformat()}
    except shopify_service.ShopifyAPIError as e:
        shopify_jobs["sync"] = {"status": "error", "error": e.detail}
    except Exception as e:
        logger.error(f"Sync job failed: {str(e)}")
        shopify_jobs["sync"] = {"status": "error", "error": str(e)}


@api_router.post("/admin/shopify/push", dependencies=[Depends(verify_admin_key)])
async def push_to_shopify():
    """Kick off a background push of the local catalog to Shopify (create or update by handle/title)"""
    settings = await shopify_service.get_settings(db)
    if not settings or not settings.get("admin_access_token"):
        raise HTTPException(status_code=400, detail="Shopify is not connected. Save your store domain and Admin API access token first.")
    if shopify_jobs["push"].get("status") == "running":
        raise HTTPException(status_code=409, detail="A push is already in progress.")
    shopify_jobs["push"] = {"status": "running", "started_at": datetime.now(timezone.utc).isoformat()}
    asyncio.create_task(_run_push_job())
    return {"status": "started"}


@api_router.get("/admin/shopify/push/status", dependencies=[Depends(verify_admin_key)])
async def get_push_status():
    return shopify_jobs["push"]


@api_router.post("/admin/shopify/sync", dependencies=[Depends(verify_admin_key)])
async def sync_from_shopify():
    """Kick off a background pull of the Shopify catalog into our database"""
    settings = await shopify_service.get_settings(db)
    if not settings or not settings.get("admin_access_token"):
        raise HTTPException(status_code=400, detail="Shopify is not connected. Save your store domain and Admin API access token first.")
    if shopify_jobs["sync"].get("status") == "running":
        raise HTTPException(status_code=409, detail="A sync is already in progress.")
    shopify_jobs["sync"] = {"status": "running", "started_at": datetime.now(timezone.utc).isoformat()}
    asyncio.create_task(_run_sync_job())
    return {"status": "started"}


@api_router.get("/admin/shopify/sync/status", dependencies=[Depends(verify_admin_key)])
async def get_sync_status():
    return shopify_jobs["sync"]


@api_router.get("/shopify/storefront-config")
async def get_storefront_config():
    """Public config for the Shopify Buy Button SDK (domain + storefront token only)"""
    settings = await shopify_service.get_settings(db)
    if not settings or not settings.get("storefront_access_token"):
        return {"configured": False}
    return {
        "configured": True,
        "domain": settings.get("domain"),
        "storefront_access_token": settings.get("storefront_access_token"),
    }


@api_router.post("/shopify/checkout")
async def create_shopify_checkout(session_id: str = Query(...)):
    """Create a Shopify checkout from the current cart and return its secure checkout URL"""
    cart = await db.carts.find_one({"session_id": session_id})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Your cart is empty.")

    settings = await shopify_service.get_settings(db)
    if not settings or not settings.get("storefront_access_token"):
        raise HTTPException(status_code=400, detail="Shopify checkout is not configured yet. Add a Storefront Access Token in the Manage Panel.")

    line_items = []
    skipped_items = []
    for item in cart["items"]:
        if item.get("shopify_variant_id"):
            line_items.append({"variant_id": item["shopify_variant_id"], "quantity": item["quantity"]})
        else:
            skipped_items.append(item["product_name"])

    if not line_items:
        raise HTTPException(status_code=400, detail="None of your cart items are synced with Shopify yet. Push/sync products first.")

    try:
        checkout_url = await shopify_service.create_storefront_checkout(settings, line_items)
        return {"checkout_url": checkout_url, "skipped_items": skipped_items}
    except shopify_service.ShopifyAPIError as e:
        raise HTTPException(status_code=400, detail=f"Shopify checkout failed: {e.detail}")


# ===================== ROOT ENDPOINT =====================
@api_router.get("/")
async def root():
    return {"message": "Shathabdhi Organics API - Welcome!"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Seed database on startup if empty"""
    try:
        object_storage.init_storage()
    except Exception as e:
        logger.error(f"Object storage init failed: {str(e)}")
    try:
        await db.products.create_index("shopify_product_id", unique=True, sparse=True)
        product_count = await db.products.count_documents({})
        if product_count == 0:
            logger.info("Database is empty. Seeding with initial data...")
            # Seed data
            if products_seed:
                await db.products.insert_many(products_seed)
            if categories_seed:
                await db.categories.insert_many(categories_seed)
            if testimonials_seed:
                await db.testimonials.insert_many(testimonials_seed)
            logger.info("Database seeded successfully!")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
