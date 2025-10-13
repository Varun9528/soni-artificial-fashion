# Lettex Marketplace - Product Display Fix Instructions

## Current Status

The Geevi product images are correctly placed in:
`C:\Users\hp\Desktop\pachmarhi\pachmarhi-marketplace\public\images\products`

However, the products are not displaying on the homepage because the database hasn't been seeded properly.

## Required Actions

### 1. Remove Tribal Art Directories (Manual Step)
Remove the following directories from `public/images/products/`:
- bamboo-lamp/
- bamboo-wall-art/
- brass-earrings/
- cane-basket/
- dokra-figurine/
- folk-doll/
- gond-painting/
- hand-carved-plate/
- handloom-sari/
- terracotta-necklace/
- tribal-cushion/
- tribal-printed-shirt/
- warli-art/

### 2. Run Database Seeding
Execute one of the following commands from the project root directory:

Option A (if TypeScript compilation works):
```bash
npx ts-node prisma/seed-geeVI-products.ts
```

Option B (using the JavaScript version):
```bash
node seed-geeVI-products.js
```

Option C (using Prisma's built-in seed command):
```bash
npm run seed
```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Verify Products Display
Visit http://localhost:3000 to see the homepage with all Geevi products displayed.

## What the Seeding Process Does

1. Scans `/public/images/products/` directory
2. Creates products from image filenames
3. Sets product name from filename (underscores replaced with spaces)
4. Sets default price to ₹100 for all products
5. Uses correct image path: `/images/products/[filename]`
6. Assigns products to the "Grocery" category
7. Generates proper slugs for URLs

## Expected Results

After completing these steps:
- All Geevi products will appear on the homepage
- Each product will display its image, name, and ₹100 price
- No tribal art products will be shown
- All images will load from the correct path
- Products will be loaded from the database (not static)

## Troubleshooting

If seeding fails:
1. Check database connection in `.env` file
2. Ensure MySQL server is running
3. Verify Prisma client is generated: `npx prisma generate`
4. Check for any error messages in the console