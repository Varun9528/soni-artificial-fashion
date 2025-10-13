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
  console.log('Starting database cleanup and seeding with Geevi products...');

  // Delete all existing data in correct order to avoid foreign key constraints
  // Delete child tables first
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.artisan.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.carts.deleteMany({});
  await prisma.wishlists.deleteMany({});
  await prisma.user_addresses.deleteMany({});
  await prisma.orders.deleteMany({});
  await prisma.users.deleteMany({});
  
  console.log('Deleted all existing data');

  // Create admin user for Lettex
  const adminUser = await prisma.user.create({
    data: {
      id: 'admin-001',
      email: 'admin@lettex.com',
      password_hash: '$2a$12$TVb7ROjbz2CJFo3K71MBGunOtW7G7NUJhIk0p6aWK4aVQJ0CaCYsO', // admin123
      name: 'Admin User',
      role: 'super_admin',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  });
  console.log('Created admin user:', adminUser.email);

  // Create categories for Lettex products
  const categories = [
    {
      id: 'cat-001',
      name_en: 'Grocery',
      name_hi: 'किराना',
      description_en: 'Fresh grocery and daily needs products',
      description_hi: 'ताजा किराना और दैनिक आवश्यकता के उत्पाद',
      image: '/images/categories/cat-grocery.jpg',
      display_order: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-002',
      name_en: 'Dairy Products',
      name_hi: 'डेयरी उत्पाद',
      description_en: 'Fresh milk and dairy products',
      description_hi: 'ताजा दूध और डेयरी उत्पाद',
      image: '/images/categories/cat-dairy.jpg',
      display_order: 2,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'cat-003',
      name_en: 'Own Brand',
      name_hi: 'अपना ब्रांड',
      description_en: 'Our own brand products',
      description_hi: 'हमारे अपने ब्रांड के उत्पाद',
      image: '/images/categories/cat-own-brand.jpg',
      display_order: 3,
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

  // Create products from images in /public/images/products
  try {
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

  console.log('Seeding completed successfully with Geevi products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });