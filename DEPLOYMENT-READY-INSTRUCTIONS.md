# Lettex Marketplace - Final Setup Instructions

## ✅ Required Actions

### 1. Clean Up Tribal Art Products
Remove all directories under `public/uploads/products` that contain tribal art:
- bamboo-basket/
- bamboo-wall-art/
- dokra-horse-figurine/
- gond-painting/
- handloom-sari/
- handwoven-shawl/
- terracotta-pot-set/
- tribal-earrings/
- tribal-headgear/
- tribal-silver-necklace/

### 2. Create Product Images
Create the following image files in `public/uploads/products/`:
1. Tamarind_Candy.jpg
2. Amla_Candy.jpg
3. Jungle_Honey.jpg
4. Baheda_Powder.jpg
5. Harada_Powder.jpg
6. Triphala_Powder.jpg
7. Herbal_Gulal.jpg
8. Handmade_Soap.jpg
9. Mahua_Laddu.jpg
10. Gond_Painting.jpg

### 3. Update Database
The seed.ts file has been updated to only include the 10 required products from your screenshot:
- Tamarind Candy
- Amla Candy
- Jungle Honey
- Baheda Powder
- Harada Powder
- Triphala Powder
- Herbal Gulal
- Handmade Soap
- Mahua Laddu
- Gond Painting

### 4. Logo Setup
Manually copy the logo file:
From: `C:\Users\hp\Desktop\pachmarhi\public\images\logo\lettex-logo.png`
To: `C:\Users\hp\Desktop\pachmarhi\pachmarhi-marketplace\public\images\logo\lettex-logo.png`

### 5. Run Seeding
After completing the above steps, run:
```
cd c:\Users\hp\Desktop\pachmarhi\pachmarhi-marketplace
npx prisma db seed
```

## ✅ Expected Results
- Only 10 products will appear on the website (matching your screenshot)
- All tribal art products will be removed
- Logo will display correctly
- No 404 errors or title crashes
- Site ready for deployment

## ⏳ Time-Sensitive Deployment
Since you mentioned this is for live deployment in 5 minutes, please:
1. Manually delete the tribal art directories
2. Copy the logo file
3. Run the seeding command