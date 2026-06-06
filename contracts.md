# Shathabdhi Organics - API Contracts & Integration Plan

## Overview
This document outlines the backend implementation plan, API contracts, and frontend-backend integration strategy for Shathabdhi Organics e-commerce platform.

---

## 1. MOCKED DATA TO BE REPLACED

Currently mocked in `/app/frontend/src/data/mockData.js`:

### Products Data (12 items)
- Product details: id, name, category, type, description, profile, price, sizes, image, badge, benefits, origin
- Categories: Millets, Spices & Powders, Cookies

### Categories Data (5 items)
- Category navigation pills with images

### Testimonials Data (4 items)
- Customer reviews with product associations

---

## 2. DATABASE MODELS (MongoDB)

### Product Model
```python
{
    _id: ObjectId,
    name: str,
    category: str,  # Millets, Spices & Powders, Cookies
    type: str,  # Whole, Flour/Atta, Powder, Blend, Ready-to-Eat
    description: str,
    profile: str,  # e.g., "Nutty | Light | Versatile"
    base_price: float,
    sizes: [
        {
            size: str,  # e.g., "250 Grams"
            price: float
        }
    ],
    image: str,  # URL
    badge: str,  # Best Seller, Great Gift, Rishi Favorite
    benefits: [str],  # Low GI, High Fibre, Gluten-Free, etc.
    origin: str,  # Telangana
    created_at: datetime,
    updated_at: datetime
}
```

### Category Model
```python
{
    _id: ObjectId,
    name: str,
    image: str,
    display_order: int,
    created_at: datetime
}
```

### Cart Model
```python
{
    _id: ObjectId,
    session_id: str,  # For guest users
    user_id: str,  # Optional, for authenticated users
    items: [
        {
            product_id: str,
            product_name: str,
            selected_size: str,
            price: float,
            quantity: int,
            image: str
        }
    ],
    total: float,
    created_at: datetime,
    updated_at: datetime
}
```

### Testimonial Model
```python
{
    _id: ObjectId,
    name: str,
    text: str,
    product_id: str,
    product_name: str,
    product_image: str,
    rating: int,  # 1-5
    created_at: datetime,
    is_featured: bool
}
```

---

## 3. API ENDPOINTS

### Products API

**GET /api/products**
- Query params: category, type, benefits, sort_by, limit, skip
- Response: List of products with pagination
```json
{
    "products": [...],
    "total": 12,
    "page": 1,
    "per_page": 20
}
```

**GET /api/products/{product_id}**
- Response: Single product details

**POST /api/products** (Admin only - future)
- Body: Product data
- Response: Created product

**PUT /api/products/{product_id}** (Admin only - future)
- Body: Updated product data
- Response: Updated product

**DELETE /api/products/{product_id}** (Admin only - future)
- Response: Success message

### Categories API

**GET /api/categories**
- Response: List of all categories

### Cart API

**GET /api/cart/{session_id}**
- Response: Cart details with items

**POST /api/cart/{session_id}/items**
- Body: { product_id, selected_size, quantity }
- Response: Updated cart

**PUT /api/cart/{session_id}/items/{item_id}**
- Body: { quantity }
- Response: Updated cart

**DELETE /api/cart/{session_id}/items/{item_id}**
- Response: Updated cart

**DELETE /api/cart/{session_id}**
- Response: Success message (clear cart)

### Testimonials API

**GET /api/testimonials**
- Query params: is_featured, limit
- Response: List of testimonials

---

## 4. BACKEND IMPLEMENTATION TASKS

1. **Database Setup**
   - Create MongoDB collections
   - Seed initial data from mock data
   - Create indexes for performance (category, type, benefits)

2. **API Endpoints**
   - Implement all CRUD operations
   - Add filtering, sorting, pagination logic
   - Implement cart management logic
   - Add error handling and validation

3. **Data Seeding Script**
   - Convert mock data to database entries
   - Populate products, categories, and testimonials

---

## 5. FRONTEND-BACKEND INTEGRATION

### Files to Modify

1. **src/pages/BestSellers.jsx**
   - Replace `import { products, categories, testimonials } from '../data/mockData'`
   - Add API calls: `fetchProducts()`, `fetchCategories()`, `fetchTestimonials()`
   - Implement loading states
   - Update filter/sort logic to make API calls
   - Update addToCart to POST to backend

2. **New Files to Create**
   - `src/services/api.js` - Centralized API service with axios
   - `src/contexts/CartContext.jsx` - Global cart state management

### Integration Steps

1. Create API service layer
2. Add loading/error states to components
3. Replace mock data imports with API calls
4. Implement cart persistence with session_id
5. Add toast notifications for user feedback

### API Service Structure
```javascript
// src/services/api.js
const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const productAPI = {
    getAll: (params) => axios.get(`${API_URL}/products`, { params }),
    getById: (id) => axios.get(`${API_URL}/products/${id}`)
};

export const cartAPI = {
    get: (sessionId) => axios.get(`${API_URL}/cart/${sessionId}`),
    addItem: (sessionId, item) => axios.post(`${API_URL}/cart/${sessionId}/items`, item),
    removeItem: (sessionId, itemId) => axios.delete(`${API_URL}/cart/${sessionId}/items/${itemId}`)
};

export const categoryAPI = {
    getAll: () => axios.get(`${API_URL}/categories`)
};

export const testimonialAPI = {
    getAll: () => axios.get(`${API_URL}/testimonials`)
};
```

---

## 6. SESSION MANAGEMENT

- Generate unique session_id on first visit (using uuid)
- Store in localStorage
- Use for cart persistence
- Future: Link to user account upon authentication

---

## 7. TESTING CHECKLIST

- [ ] GET /api/products returns all products
- [ ] GET /api/products with filters works correctly
- [ ] POST /api/cart/{session_id}/items adds product to cart
- [ ] GET /api/cart/{session_id} retrieves cart correctly
- [ ] DELETE /api/cart/{session_id}/items/{item_id} removes item
- [ ] Frontend displays products from API
- [ ] Filters trigger API calls and update UI
- [ ] Add to cart functionality works end-to-end
- [ ] Cart persistence across page refreshes

---

## 8. ERROR HANDLING

### Backend
- 400: Bad Request (invalid data)
- 404: Not Found (product/cart not found)
- 500: Internal Server Error

### Frontend
- Display user-friendly error messages
- Retry mechanisms for failed requests
- Loading states during API calls
- Fallback UI for empty states
