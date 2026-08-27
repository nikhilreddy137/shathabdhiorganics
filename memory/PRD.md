# Shathabdhi Organics — PRD

## Original Problem Statement
Build the Shathabdhi Organics e-commerce landing page/store locally from https://github.com/nikhilreddy137/shathabdhiorganics, with the full product catalog sourced live from the connected Shopify store.

## Tech Stack
- Backend: FastAPI + Motor (MongoDB) on :8001, all routes under `/api`
- Frontend: React 19 + CRA/Craco + Tailwind + Radix UI on :3000
- DB: local MongoDB (MONGO_URL / DB_NAME from backend/.env)
- Shopify: Admin API (catalog push/pull) + Storefront API (cartCreate checkout), credentials stored in `settings` collection

## User Personas
- Shoppers browsing/buying organic millets, spices, oils, etc. (Telangana women-farmer collective brand)
- Store admin managing the Shopify connection via /admin/shopify (key-protected)

## Implemented (Aug 27, 2026 — this session)
- Cloned the GitHub repo into /app (backend + frontend), installed all deps, wired env (MONGO_URL, DB_NAME, ADMIN_PANEL_KEY)
- Connected the live Shopify store (c33fcd-d5.myshopify.com) with user-provided Admin + Storefront tokens
- Ran full catalog sync: 168 products pulled from Shopify (Shopify is now source of truth)
- Deleted 47 stale local seed products (all had broken images from an old Shopify CDN) — catalog now 167 storefront products
- Removed junk Shopify billing product ("Payment For", Subscription Management) locally and excluded that category from public products + search endpoints (sync-safe)
- Rebuilt the categories collection (21 categories) from live Shopify data, each with a real product image
- Frontend updated to the real catalog: dynamic `/collections/:slug` route, full PATH_TO_CATEGORY map (21 categories), header nav + footer links updated, Home category-gallery slugify strips commas
- Verified end-to-end: home, collection listing (images load), product detail, add-to-cart, search, and real Shopify checkout URL generation (shathabdhiorganics.com checkout)

## Known Gaps / Notes
- Auto-seed on startup only runs when products collection is empty (safe — 164 products present)
- Storefront has no user auth (by design)

## Implemented (Aug 27, 2026 — session 2)
- Founder video section on About page ("In Her Own Words") — click-to-play cinematic video with Sri Bhanu portrait poster, native controls on play
- Removed 3 photo-less Shopify products (White Sesame Cold Pressed Oil, Multi Millet Idli Rava, Jowar Rich Multi Grain Atta); products + search endpoints now exclude image-less products so future Shopify syncs keep them hidden (sync-safe)
- Fixed 3 broken old-CDN images in the About gallery (millet, chilli powder, basmati) with live Shopify CDN URLs — gallery verified 0 broken images

## Backlog
- P0: none blocking
- P1: Founder video on About page (carried over from original project), category filters sidebar to include new categories ordering
- P2: User accounts/auth, order history, wishlist
