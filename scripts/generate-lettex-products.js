const fs = require('fs');
const path = require('path');

// Function to copy all product images from source to destination
function copyProductImages() {
  const sourceDir = 'c:\\Users\\hp\\Desktop\\pachmarhi\\public\\uploads\\products';
  const destDir = 'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\public\\uploads\\products';
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Read all files from source directory
  const files = fs.readdirSync(sourceDir);
  
  // Copy each file
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    // Copy file
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to ${destPath}`);
  });
  
  console.log('All product images copied successfully!');
  return files;
}

// Function to generate slug from filename
function generateSlug(filename) {
  return filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to determine category based on filename
function determineCategory(filename) {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('milk') || lowerFilename.includes('curd') || 
      lowerFilename.includes('butter') || lowerFilename.includes('cheese') ||
      lowerFilename.includes('dairy') || lowerFilename.includes('paneer')) {
    return { id: 'cat-002', name: 'Dairy Products' };
  }
  
  if (lowerFilename.includes('atta') || lowerFilename.includes('dal') || 
      lowerFilename.includes('rice') || lowerFilename.includes('oil') ||
      lowerFilename.includes('salt') || lowerFilename.includes('sugar') ||
      lowerFilename.includes('grocery') || lowerFilename.includes('besan') ||
      lowerFilename.includes('chana') || lowerFilename.includes('moong') ||
      lowerFilename.includes('urad') || lowerFilename.includes('masoor') ||
      lowerFilename.includes('noodles') || lowerFilename.includes('biscuits') ||
      lowerFilename.includes('coffee') || lowerFilename.includes('tea') ||
      lowerFilename.includes('pickle') || lowerFilename.includes('ghee') ||
      lowerFilename.includes('flour') || lowerFilename.includes('lentil')) {
    return { id: 'cat-001', name: 'Grocery' };
  }
  
  return { id: 'cat-003', name: 'Own Brand' };
}

// Function to generate product name from filename
function generateProductName(filename) {
  // Remove extension and convert to title case
  let name = filename.replace(/\.[^/.]+$/, "");
  // Replace underscores and hyphens with spaces
  name = name.replace(/[_-]/g, ' ');
  // Convert to title case
  return name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Function to generate products array
function generateProducts(files) {
  const products = files.map((file, index) => {
    const filename = file.replace(/\.[^/.]+$/, ""); // Remove extension
    const slug = generateSlug(file);
    const id = `prod-${String(index + 1).padStart(3, '0')}`;
    const category = determineCategory(file);
    const name = generateProductName(file);
    
    return {
      id: id,
      slug: slug,
      title_en: name,
      title_hi: name, // You can add Hindi translations here
      description_en: `High quality ${name} from Lettex`,
      description_hi: `लेटेक्स से उच्च गुणवत्ता वाला ${name}`, // Hindi description
      price: 99, // Default price as requested
      original_price: 120, // 20% higher original price
      sku: `LT-${String(index + 1).padStart(3, '0')}`,
      stock: Math.floor(Math.random() * 100) + 20, // Random stock between 20-120
      material: 'Various',
      category_id: category.id,
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
      review_count: Math.floor(Math.random() * 50), // Random reviews
      view_count: Math.floor(Math.random() * 200), // Random views
      sales_count: Math.floor(Math.random() * 100), // Random sales
      tags: '["lettex", "premium", "quality"]',
      featured: Math.random() > 0.7, // 30% chance of being featured
      best_seller: Math.random() > 0.8, // 20% chance of being best seller
      is_active: true,
      image_path: `/uploads/products/${file}` // Image path for frontend
    };
  });
  
  return products;
}

// Function to generate Prisma seed data
function generatePrismaSeedData(products) {
  const seedData = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database cleanup and seeding...');

  // Delete all existing data in correct order to avoid foreign key constraints
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.artisan.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.user.deleteMany({});
  
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

  // Create products
  const products = ${JSON.stringify(products, null, 2)};

  for (const productData of products) {
    // Create product without image_path field (it's not in the database schema)
    const { image_path, ...productWithoutImagePath } = productData;
    
    const product = await prisma.product.create({
      data: {
        ...productWithoutImagePath,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    // Create product image
    if (image_path) {
      await prisma.productImage.create({
        data: {
          id: \`img-\${product.id}\`,
          product_id: product.id,
          image_url: image_path,
          alt_text: product.title_en,
          display_order: 1,
          is_primary: true,
          created_at: new Date()
        }
      });
    }
    
    console.log('Created product:', product.title_en);
  }

  console.log('Seeding completed successfully with ${products.length} products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

  return seedData;
}

// Main execution
try {
  console.log('Starting product generation process...');
  
  // Copy product images
  const files = copyProductImages();
  
  // Generate products from files
  const products = generateProducts(files);
  
  // Generate Prisma seed data
  const seedData = generatePrismaSeedData(products);
  
  // Write seed data to file
  const seedFilePath = path.join(__dirname, '..', 'prisma', 'seed.ts');
  fs.writeFileSync(seedFilePath, seedData);
  console.log(`Generated seed file with ${products.length} products at ${seedFilePath}`);
  
  // Write products data to JSON file for reference
  const productsFilePath = path.join(__dirname, 'products.json');
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  console.log(`Generated products JSON file at ${productsFilePath}`);
  
  console.log('Product generation process completed successfully!');
} catch (error) {
  console.error('Error in product generation process:', error);
}