const { PrismaClient, Prisma } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Function to generate product name from filename
function generateProductName(filename) {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  // Replace underscores and hyphens with spaces
  const nameWithSpaces = nameWithoutExt.replace(/[_-]/g, ' ');
  // Capitalize first letter of each word
  return nameWithSpaces.replace(/\b\w/g, l => l.toUpperCase());
}

async function main() {
  console.log('Starting product seeding with Geevi products...');

  try {
    // Delete existing products and product images only
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({}); // Also delete categories
    console.log('Deleted existing products and categories');
    
    // Create Lettex categories
    const categories = [
      {
        id: 'cat-001',
        name_en: 'Herbal Powders',
        name_hi: 'हर्बल पाउडर',
        description_en: 'Natural herbal powders for daily wellness',
        description_hi: 'दैनिक स्वास्थ्य के लिए प्राकृतिक हर्बल पाउडर',
        image: '/images/categories/cat-herbal-powders.jpg',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'cat-002',
        name_en: 'Organic Candy',
        name_hi: 'जैविक कैंडी',
        description_en: 'Delicious organic candies made from natural ingredients',
        description_hi: 'प्राकृतिक सामग्री से बनी स्वादिष्ट जैविक कैंडी',
        image: '/images/categories/cat-organic-candy.jpg',
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'cat-003',
        name_en: 'Natural Honey',
        name_hi: 'प्राकृतिक शहद',
        description_en: 'Pure natural honey from the forests of India',
        description_hi: 'भारत के जंगलों से शुद्ध प्राकृतिक शहद',
        image: '/images/categories/cat-natural-honey.jpg',
        display_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'cat-004',
        name_en: 'Handmade Soap',
        name_hi: 'हस्तनिर्मित साबुन',
        description_en: 'Handmade soaps with natural ingredients',
        description_hi: 'प्राकृतिक सामग्री के साथ हस्तनिर्मित साबुन',
        image: '/images/categories/cat-handmade-soap.jpg',
        display_order: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'cat-005',
        name_en: 'Ayurvedic Products',
        name_hi: 'आयुर्वेदिक उत्पाद',
        description_en: 'Traditional Ayurvedic products for wellness',
        description_hi: 'स्वास्थ्य के लिए पारंपरिक आयुर्वेदिक उत्पाद',
        image: '/images/categories/cat-ayurvedic-products.jpg',
        display_order: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData
      });
      console.log('Created category:', category.name_en);
    }
    
    // Get all product images from the correct directory
    const productsDir = path.join(__dirname, 'public', 'images', 'products');
    console.log('Looking for products in:', productsDir);
    
    if (fs.existsSync(productsDir)) {
      // Read all files in the products directory
      const files = fs.readdirSync(productsDir);
      
      // Filter out directories, keep only image files
      const imageFiles = files.filter(file => {
        const fullPath = path.join(productsDir, file);
        return fs.statSync(fullPath).isFile() && !file.startsWith('.') && 
               (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp'));
      });
      
      console.log(`Found ${imageFiles.length} product images`);
      
      // Create new products from images
      let productCount = 0;
      for (const filename of imageFiles) {
        try {
          const productName = generateProductName(filename);
          // Use the correct image path
          const imagePath = `/images/products/${filename}`;
          
          const product = await prisma.product.create({
            data: {
              id: `prod-${String(productCount + 1).padStart(4, '0')}`,
              slug: productName.toLowerCase().replace(/\s+/g, '-'),
              title_en: productName,
              title_hi: productName,
              description_en: `Fresh ${productName} product from Lettex`,
              description_hi: `लेटेक्स से ताजा ${productName} उत्पाद`,
              price: new Prisma.Decimal(100), // Default price as requested
              original_price: new Prisma.Decimal(120),
              stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
              category_id: 'cat-001', // Default to Grocery category
              created_at: new Date(),
              updated_at: new Date()
            }
          });
          
          // Create product image
          await prisma.productImage.create({
            data: {
              id: `img-${String(productCount + 1).padStart(4, '0')}`,
              product_id: product.id,
              image_url: imagePath,
              alt_text: productName,
              is_primary: true,
              created_at: new Date()
            }
          });
          
          console.log(`Created product: ${product.title_en} (${product.id})`);
          productCount++;
        } catch (error) {
          console.error(`Error creating product from ${filename}:`, error.message);
        }
      }
      
      console.log(`Successfully created ${productCount} products from images`);
    } else {
      console.log('Products directory not found, skipping product creation');
    }
  } catch (error) {
    console.error('Error in product seeding process:', error.message);
  }

  console.log('Product seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });