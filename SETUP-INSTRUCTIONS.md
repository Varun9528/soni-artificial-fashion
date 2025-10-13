# Lettex Marketplace - Logo and Product Setup Instructions

## Logo Setup

The logo file needs to be manually copied from:
`C:\Users\hp\Desktop\pachmarhi\public\images\logo\lettex-logo.png`

To:
`C:\Users\hp\Desktop\pachmarhi\pachmarhi-marketplace\public\images\logo\lettex-logo.png`

Please manually copy this file using Windows File Explorer.

## Product Setup

The product images are located in:
`C:\Users\hp\Desktop\pachmarhi\pachmarhi-marketplace\public\uploads\products`

To seed the database with products based on these images, run:
```
cd c:\Users\hp\Desktop\pachmarhi\pachmarhi-marketplace
npx prisma db seed
```

This will:
1. Delete all existing products
2. Create new products using the image filenames as product names
3. Link each product to its corresponding image

## Verification

After completing the above steps:
1. Visit http://localhost:3000/test-logo.html to verify the logo is working
2. Visit http://localhost:3000/products to verify products are displayed correctly