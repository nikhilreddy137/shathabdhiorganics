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

## Implemented (Aug 27, 2026 — session 3: Typography & Imagery Overhaul PRD)
- Fonts: self-hosted Instrument Serif (display) + Hanken Grotesk variable (body) as WOFF2 in /public/fonts (~178KB), loaded via /public/fonts.css + preloads; metric-tuned local fallbacks; all Cormorant/Lato/Inter removed
- Tokens: fluid clamp() type scale in tailwind.config.js (text-hero/h1/h2/h3/body-lg/body/eyebrow); base layer sets font-display on h1–h4 (weight 400), font-body on body; text-wrap balance/pretty; .price = tabular-nums; .measure = 68ch
- Imagery: `Img` component (src/components/Img.jsx) — srcset across 8 widths for Shopify/Unsplash/Pexels CDNs, aspect-ratio frames (CLS-safe), LQIP blur-up, priority/lazy, alt required
- Home rebuilt (award-style): kinetic hero with masked line-by-line reveal ("A century of soil, / in every grain"), cinematic grain-sack video (mixkit 48769) with slow Ken Burns zoom + parallax + local poster, editorial marquee, numbered manifesto chapters (01/02/03), category gallery, cinematic rotating TestimonialStage (giant quote mark, progress-bar dots, auto-advance 6s)
- Catalog rebuilt (/collections/*): category rail (snap-scroll circular tiles), sticky filter/sort bar (52px, top-20), 2/3/4-col grid, Rishi-style product cards (title serif, descriptor, character triple, from-price, variant chips), Quick Add (inline for single-variant, bottom sheet for multi), full-screen FilterSheet (live counts, zero-result disabled, pinned Clear all/Show N), SortSheet (radio), applied filter chips, URL query param state (?benefits, ?sort), editorial break-in cards every 8 products (hidden when filtered), skeleton loaders, proper empty/error states — pagination kept as "show all" per user choice
- Mobile UX: sticky mobile ATC on product detail (IntersectionObserver), safe-area insets, 44px targets, overflow-x clip, global sticky bar hidden on /product
- Motion: lenis smooth scrolling (SmoothScroll wrapper, reduced-motion aware), framer-motion Reveal/SplitLines/Marquee primitives
- Fixes: replaced 5 dead Shopify CDN URLs (404) in Home CHAPTERS, EditorialCard, Social.jsx with live catalog/Unsplash images; backend per_page cap raised 100→200
- Testing: full frontend pass by testing agent (iteration_1.json) — ALL features verified, no console errors, no broken images, fonts resolve correctly, no overflow at 320px
- [2026-06] Home "Featured selections" now shows only iconic branded studio photos: hasStudioPhoto() in Home.jsx hides generic WhatsApp catalog snapshots (wa_catalog_*, Waiting_for_*). "All" chip round-robins one standout per category (CATEGORY_PRIORITY order) for a curated 8-item iconic grid; category chips show up to 8 studio products. Filter is Home-only — Shop All / category pages keep the full catalog so nothing is unbuyable. Verified via live API data (8 clean diverse picks, 0 wa_catalog).
- [2026-06] Removed "Amla Pickle in Cold Pressed Oil (250g)" from the storefront via EXCLUDED_PRODUCT_NAMES in server.py (applied to GET /api/products list + /api/products/search). Catalog now 163 products; verified absent from list and search.
- [2026-06] Home hero is now a 3-video auto-rotating stack (HERO_VIDEOS in Home.jsx), crossfading every 6.5s with clickable indicator dots (data-testid hero-video-dot-0..2). First video unchanged (mixkit 48769, hands in grain); added golden wheat harvest (22437) + harvested-grain close-up (20998) for organic essence. All 3 URLs verified live (206 video/mp4).
- [2026-06] Hero videos 2 & 3 upgraded per user: video 2 → mixkit 2122-1080 (crop fields at sunrise, Full HD for clarity), video 3 → mixkit 520-1080 (sunlight through tall forest trees, forest-organics concept). Both verified HTTP 200 and rendering in DOM via screenshot.
- [2026-06] Full Telangana earth-tone palette overhaul per user brief (design_agent guidelines in /app/design_guidelines.json). Tailwind tokens added: soil #3E2A1E, gold #C69C45, leaf #415D39, cream #F9F7F3, cream2 #F0EBE1, cream3 #E6DFD3, jaggery #B55A2A, charcoal #272522, ink #5C5852. Restyled: Header (cream/85 backdrop-blur, soil banner, jaggery cart badge), Footer (deep soil brown, gold hovers, rounded-full newsletter CTA), ProductCard (rounded-2xl white cards, brown hover shadow, jaggery rounded quick-add pill, soil semibold prices), Home (cream bg, leaf-green marquee, gold hero accents + rounded-full CTAs, charcoal manifesto with gold eyebrows, rounded-2xl chapter images + category tiles, ch-01 image swapped to soil-in-hands per 'no generic green-field stock'), BestSellers (cream bg, cream sticky bar, rounded-full chips/buttons, cream2 reviews, leaf-green Instagram CTA with gold button), ProductDetail (rounded-full size/qty/ATC in soil, gold badges, leaf benefit chips, rounded-2xl related cards), CartDrawer/QuickAddSheet/FilterSheet/SortSheet/CategoryRail/EditorialCard/TestimonialStage/MobileStickyBar/SearchOverlay all mapped to new tokens. shadcn --background set to cream HSL (40 33% 96%) so body is cream. Deleted stray BestSellers.jsx.bak. Testing agent iteration_2: 100% frontend flows pass, zero console errors; 'Shop All scroll' bug NOT reproducible (full-range scroll verified, docHeight 27583).
- [2026-06] Health Journal + SEO Blog shipped: (1) 4-video cinematic Health Journal (why organic / millets & insulin no-spike / diabetic day / food-as-medicine) with doctor-style copy + expandable Doctor's Note dialogs (components/HealthJournal.jsx, data/healthJournal.js) — compact section on Home below featured products + full /health page with hero, GI comparison table, 6-item FAQ accordion (FAQPage JSON-LD) and CTAs. Videos: mixkit 9202-720/24913-720/40515-1080/40536-1080, all verified HTTP 200. (2) /blog index + /blog/:slug with 6 pre-written long-form SEO articles (data/blogPosts.js): millets-for-diabetes-low-gi-guide, why-organic-food-matters, glycemic-index-indian-grains, cold-pressed-oils-vs-refined, how-to-switch-to-millets-30-days, siridhanya-millets-guide. Each: meta title/description/keywords, OG tags, canonical, JSON-LD Article + FAQPage + BreadcrumbList (absolute URLs) via custom components/Seo.jsx, FAQ accordion, product CTAs, related posts. (3) public/sitemap.xml (14 URLs) + robots.txt + enriched index.html base meta + Organization JSON-LD. Header nav + footer gained Health & Blog links. Home got Seo component. Testing agent iteration_3: 22/24 pass.
- [2026-06] Health Journal videos INDIANIZED per user: swapped Western mixkit clips for Pexels Indian footage (free license, verified 200) — why-organic: 8732183 Indian farmers harvesting by hand (960x540, 2MB); millets-insulin: 5636708 Indian villagers harvesting grain field (960x540, 3MB); diabetic-day: 30044762 Indian dal khichdi meal (1080x1920, 3MB); food-as-medicine: 9346247 Indian mother & son cooking in home kitchen (540x960, 1MB). Verified all 4 wired in DOM on /health.
- [2026-06] Health Journal videos made MILLET-focused per user: why-organic → pexels 12658936 (bajra/pearl millet hand-harvest, India, 1080p 12MB); millets-insulin → pexels 7000020 (pearl millet field cultivation, 6MB); diabetic-day → kept 30044762 (dal khichdi); food-as-medicine → pexels 9466963 (elderly Indian man mixing millets with wooden spoon, 5MB) — the mother & child kitchen video was REMOVED per user request. All 4 wired & verified in DOM.
- KNOWN PLATFORM LIMITATION: preview.emergentagent.com edge returns 403 for /sitemap.xml and overrides /robots.txt with a platform policy file. NOT an app bug — both files verified serving correctly from CRA at localhost:3000; they will serve normally on a deployed/custom domain.

## Backlog
- P1: Category filters sidebar ordering (superseded by new FilterSheet — review if still needed)
- P2: User accounts/auth, order history, wishlist
- P2: Hover-swap second product image on cards (needs 2nd image synced from Shopify)
- P2: Video testimonials in reviews section
