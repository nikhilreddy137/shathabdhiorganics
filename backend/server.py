from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from models import (
    Product, ProductCreate, Category, Cart, CartItem, 
    AddCartItem, UpdateCartItem, Testimonial, PaginatedProducts
)
from seed_data import products_seed, categories_seed, testimonials_seed

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


# ===================== SEED DATABASE =====================
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
    per_page: int = Query(20, ge=1, le=100)
):
    """Get all products with filtering, sorting, and pagination"""
    try:
        # Build filter query
        query = {}
        
        if category:
            query["category"] = category
        
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
        
        await db.products.insert_one(product_obj.dict())
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
                image=product["image"]
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
