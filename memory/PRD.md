# Shathabdhi Organics — PRD

## Original Problem Statement
User uploaded `shathabdhiorganics-main.zip` (e-commerce platform for organic millets, spices, rices, oils, dals, cookies, processed products from Telangana). Goal: set up + fix issues so it runs end-to-end. No third-party integrations needed.

## Tech Stack
- Backend: FastAPI + Motor (MongoDB) on :8001, all routes under `/api`
- Frontend: React 19 + CRA/Craco + Tailwind + Radix UI + framer-motion on :3000
- DB: Local MongoDB, auto-seeds 28 products / 7 categories / 4 testimonials on backend startup

## Architecture
- `/app/backend/server.py` — FastAPI app, routers for products / categories / cart / testimonials
- `/app/backend/models.py` — Pydantic models
- `/app/backend/seed_data.py` — Seed data sourced from live Shopify store
- `/app/frontend/src/App.js` — React Router routes incl. `/collections/<slug>`
- `/app/frontend/src/pages/Home.jsx` — Home with 4-slide auto-rotating hero carousel
- `/app/frontend/src/pages/BestSellers.jsx` — Collection listing with filters/sort
- `/app/frontend/src/contexts/CartContext.jsx` — session-id based cart
- `/app/frontend/src/services/api.js` — axios layer

## Implemented (Jun 06, 2026)
- Full project setup from uploaded zip — backend + frontend both running under supervisor
- All deps installed (`pip` + `yarn`), DB auto-seeded on startup
- Verified home, collections, product listing, filters, sort all working end-to-end against backend
- **Hero carousel upgrade**: replaced static grain close-up with 4-slide auto-rotating carousel of earthy/scenic imagery (golden sunset field → green crop → grain macro → misty pastoral), 5s interval, clickable indicators, smooth 1.8s fade + scale transitions, stronger gradient overlay for readable text on all images

## Next Action Items (P1)
- Build product detail pages (currently no individual product route)
- Implement search functionality (search icon present in header)
- Add user account / login flow (icon present)
- Checkout flow (cart exists but no checkout)

## Backlog (P2)
- Newsletter subscribe API endpoint (form exists but not wired)
- Admin panel for managing products
- Pagination UI on collection pages
