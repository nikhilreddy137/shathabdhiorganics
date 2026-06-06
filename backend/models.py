from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid


class ProductSize(BaseModel):
    size: str
    price: float


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    type: str
    description: str
    profile: str
    base_price: float
    sizes: List[ProductSize]
    image: str
    badge: Optional[str] = None
    benefits: List[str]
    origin: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(BaseModel):
    name: str
    category: str
    type: str
    description: str
    profile: str
    base_price: float
    sizes: List[ProductSize]
    image: str
    badge: Optional[str] = None
    benefits: List[str]
    origin: str


class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    image: str
    display_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CartItem(BaseModel):
    product_id: str
    product_name: str
    selected_size: str
    price: float
    quantity: int = 1
    image: str


class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    items: List[CartItem] = []
    total: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class AddCartItem(BaseModel):
    product_id: str
    selected_size: str
    quantity: int = 1


class UpdateCartItem(BaseModel):
    quantity: int


class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    text: str
    product_id: str
    product_name: str
    product_image: str
    rating: int = 5
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_featured: bool = True


class PaginatedProducts(BaseModel):
    products: List[Product]
    total: int
    page: int
    per_page: int
