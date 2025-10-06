# 🎯 FINAL AI/DEV HANDOFF: Complete Pachmarhi Tribal Art Marketplace

## OBJECTIVE
Finish the Pachmarhi Tribal Art marketplace so it's a fully functional, production-ready Flipkart-style e-commerce site. All user flows working, admin controlling content, real DB persistence, mock/real payments wired.

## CRITICAL REQUIREMENTS - MUST COMPLETE ALL

### 1. DATABASE CONNECTION & SEEDING
- [ ] Connect to MySQL/PostgreSQL (replace mock data)
- [ ] Run `database/schema.sql` migration
- [ ] Import `seed.json` data into database
- [ ] Create npm scripts: `migrate`, `seed`, `db:reset`

### 2. AUTHENTICATION (REAL DB)
- [ ] Replace mock auth with real database queries
- [ ] Implement bcrypt password hashing
- [ ] JWT access tokens (15min) + refresh tokens (HttpOnly cookies)
- [ ] Role-based access control enforcement
- [ ] Password reset flow
- [ ] Email verification (mock SMTP if needed)

### 3. ADMIN PANEL - FULL CRUD
- [ ] Products: Create/Edit/Delete with image upload, variants, stock
- [ ] Categories: CRUD with hierarchy
- [ ] Banners: Upload, reorder, link management
- [ ] Artisans: Profile management with images
- [ ] Orders: Status management, tracking assignment
- [ ] Users: Role management, account control
- [ ] Analytics dashboard: revenue, orders, top products

### 4. COMPLETE SHOPPING FLOW
- [ ] Product listing with filters (category, price, rating, artisan)
- [ ] Product detail with image gallery, variants, reviews
- [ ] Cart persistence (DB for logged, localStorage for guests)
- [ ] Multi-step checkout with address validation
- [ ] Payment integration: Mock + Stripe/Razorpay switch
- [ ] Order confirmation with email
- [ ] Order tracking page

### 5. MISSING PAGES & FEATURES
- [ ] `/artisans` directory with individual profiles
- [ ] Wishlist & Compare pages with persistence
- [ ] Returns & Refunds workflow
- [ ] Search with autocomplete and filters
- [ ] PWA: manifest, service worker, offline support

### 6. REAL IMAGES (NOT PLACEHOLDERS)
- [ ] Create/download actual images for all categories, products, artisans
- [ ] Must match exact paths in `seed.json`
- [ ] Images must be >1KB (not empty files)
- [ ] Image upload functionality in admin

### 7. UI/UX POLISH
- [ ] Dark/light mode across ALL pages
- [ ] Skeleton loaders for async content
- [ ] Hero carousel with auto-play
- [ ] Product hover animations
- [ ] Mobile responsiveness
- [ ] Page transitions

### 8. INTERNATIONALIZATION
- [ ] Complete English translations in `/public/locales/en.json`
- [ ] Complete Hindi translations in `/public/locales/hi.json`
- [ ] Language toggle with persistence
- [ ] All UI text translatable

### 9. SECURITY & PERFORMANCE
- [ ] Security headers (CSP, HSTS)
- [ ] Input validation & SQL injection protection
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout mechanism
- [ ] Image optimization & lazy loading
- [ ] Lighthouse score >90 performance

### 10. TESTING & QA
- [ ] Unit tests for auth, cart, orders
- [ ] Integration tests for checkout flow
- [ ] Manual QA of all user journeys
- [ ] Admin functionality verification

## EXACT IMAGE FILE STRUCTURE REQUIRED
```
/public/images/
├── hero/
│   ├── hero1.jpg
│   ├── hero2.jpg
│   ├── hero3.jpg
│   ├── hero4.jpg
│   └── hero5.jpg
├── categories/
│   ├── cat-tribal-shirts.jpg
│   ├── cat-jewelry.jpg
│   ├── cat-handloom-textiles.jpg
│   ├── cat-home-decor.jpg
│   ├── cat-accessories.jpg
│   └── cat-gifts-souvenirs.jpg
├── artisans/
│   ├── arti-sarla.jpg
│   ├── arti-ramesh.jpg
│   ├── arti-meera.jpg
│   └── arti-raj.jpg
└── products/
    ├── bamboo-wall-art/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── handloom-sari/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── terracotta-necklace/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── dokra-figurine/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── tribal-printed-shirt/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── cane-basket/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── gond-painting/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── brass-earrings/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── hand-carved-plate/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── tribal-cushion/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    ├── bamboo-lamp/
    │   ├── img1.jpg
    │   ├── img2.jpg
    │   └── img3.jpg
    └── folk-doll/
        ├── img1.jpg
        ├── img2.jpg
        └── img3.jpg
```

## FINAL ACCEPTANCE CRITERIA

Before submission, ALL must pass:

✅ **Basic Functionality**
- [ ] `npm run dev` starts successfully
- [ ] All pages load (no 404s): /, /login, /register, /profile, /cart, /checkout, /admin
- [ ] Header/footer visible on every page
- [ ] Dark/light mode toggle works and persists

✅ **User Journey**
- [ ] Register new user → login → view profile → edit profile
- [ ] Add products to cart → proceed to checkout → place order
- [ ] Order appears in profile and admin panel
- [ ] Wishlist add/remove functionality

✅ **Admin Control**
- [ ] Admin login → create new product with image → visible on frontend
- [ ] Edit existing product → changes reflect immediately
- [ ] Manage orders: change status, add tracking
- [ ] View analytics: revenue, orders, top products

✅ **Technical Requirements**
- [ ] Real database connection (not mock data)
- [ ] JWT authentication with refresh tokens
- [ ] All images display (not broken placeholders)
- [ ] Search returns filtered/sorted results
- [ ] PWA installable with offline support
- [ ] Security: rate limiting, input validation, RBAC

✅ **UI/UX Quality**
- [ ] Professional Flipkart-style design
- [ ] Mobile responsive on all pages
- [ ] Loading states and error handling
- [ ] Smooth animations and transitions
- [ ] Consistent branding and typography

## DELIVERABLES REQUIRED

1. **Complete Project**
   - Git repository or ZIP file
   - All source code and assets
   - Database migration files
   - Seed data scripts

2. **Documentation**
   - README.md with setup instructions
   - .env.example with all variables
   - API documentation
   - Admin user guide

3. **Verification Materials**
   - Screenshots of key pages (light/dark mode)
   - QA checklist with all items verified
   - Performance report (Lighthouse scores)
   - Demo credentials for testing

4. **Setup Commands**
   ```bash
   npm install
   npm run migrate
   npm run seed
   npm run dev
   npm run build
   npm start
   ```

## DEMO CREDENTIALS
- **Admin**: admin@pachmarhi.com / admin123
- **User**: user@pachmarhi.com / user123

---

**CRITICAL**: Do not mark this complete until EVERY checkbox is verified and ALL acceptance criteria pass. This must be a production-ready, fully functional e-commerce marketplace matching the quality of Flipkart/Amazon.

**Timeline**: Complete within 48 hours with full verification report.

**Contact**: Provide progress updates every 12 hours with current completion status.