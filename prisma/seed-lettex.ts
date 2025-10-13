import { PrismaClient, Product, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Function to generate product name from filename
function generateProductName(filename: string): string {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  // Replace underscores and hyphens with spaces
  const nameWithSpaces = nameWithoutExt.replace(/[_-]/g, ' ');
  // Capitalize first letter of each word
  return nameWithSpaces.replace(/\b\w/g, l => l.toUpperCase());
}

async function main() {
  console.log('Starting Lettex product seeding...');
  
  try {
    // Get all product images
    const productsDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
    console.log('Looking for products in:', productsDir);
    
    if (!fs.existsSync(productsDir)) {
      console.error('Products directory not found');
      return;
    }
    
    // Read all files in the products directory
    const files = fs.readdirSync(productsDir);
    
    // Filter out directories, keep only files
    const imageFiles = files.filter(file => {
      const fullPath = path.join(productsDir, file);
      return fs.statSync(fullPath).isFile() && !file.startsWith('.') && 
             (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp'));
    });
    
    console.log(`Found ${imageFiles.length} product images`);
    
    // Delete existing products first
    console.log('Deleting existing products...');
    await prisma.product.deleteMany({});
    console.log('Deleted existing products');
    
    // Create new products from images
    let productCount = 0;
    for (const filename of imageFiles) {
      try {
        const productName = generateProductName(filename);
        const imagePath = `/uploads/products/${filename}`;
        
        const product = await prisma.product.create({
          data: {
            id: `prod-${String(productCount + 1).padStart(4, '0')}`,
            slug: productName.toLowerCase().replace(/\s+/g, '-'),
            title_en: productName,
            title_hi: productName,
            description_en: `Fresh ${productName} product from Lettex`,
            description_hi: `लेटेक्स से ताजा ${productName} उत्पाद`,
            price: new Prisma.Decimal(Math.floor(Math.random() * 500) + 50), // Random price between 50-550
            original_price: new Prisma.Decimal(Math.floor(Math.random() * 600) + 100), // Random original price
            stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
            category_id: 'cat-001', // Default to Grocery category
            created_at: new Date(),
            updated_at: new Date()
          }
        });
        
        // Create product image
        await prisma.productImage.create({
          data: {
            product_id: product.id,
            image_url: imagePath,
            alt_text: productName,
            is_primary: true,
            created_at: new Date()
          }
        });
        
        console.log(`Created product: ${product.title_en} (${product.id})`);
        productCount++;
      } catch (error: any) {
        console.error(`Error creating product from ${filename}:`, error.message);
      }
    }
    
    console.log(`Successfully created ${productCount} products`);
    
  } catch (error: any) {
    console.error('Error in seeding process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });