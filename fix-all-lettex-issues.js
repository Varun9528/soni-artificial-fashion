const fs = require('fs');
const path = require('path');

console.log('Starting Lettex marketplace fixes...');

// 1. Fix Logo
console.log('\n1. Fixing Logo...');
try {
  const sourceLogo = path.join(__dirname, '..', 'public', 'images', 'logo', 'lettex logo.png');
  const destLogo = path.join(__dirname, 'public', 'images', 'logo', 'lettex-logo.png');
  
  console.log('Checking source logo:', sourceLogo);
  console.log('Checking destination logo:', destLogo);
  
  if (fs.existsSync(sourceLogo)) {
    console.log('Source logo exists, copying...');
    // Delete destination if it exists
    if (fs.existsSync(destLogo)) {
      fs.unlinkSync(destLogo);
      console.log('Deleted existing destination logo');
    }
    
    fs.copyFileSync(sourceLogo, destLogo);
    console.log('✅ Logo copied successfully!');
  } else {
    console.log('Source logo not found, checking if destination already has content...');
    if (fs.existsSync(destLogo)) {
      const stats = fs.statSync(destLogo);
      if (stats.size === 0) {
        console.log('⚠️  Destination logo exists but is empty');
      } else {
        console.log('✅ Destination logo already exists with content');
      }
    } else {
      console.log('❌ Source logo not found and destination logo does not exist');
    }
  }
} catch (error) {
  console.log('Error fixing logo:', error.message);
}

// 2. Generate Products from Images
console.log('\n2. Generating Products from Images...');
try {
  const productsDir = path.join(__dirname, 'public', 'uploads', 'products');
  
  if (!fs.existsSync(productsDir)) {
    console.log('❌ Products directory not found');
    process.exit(1);
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
  
  // Function to generate product name from filename
  function generateProductName(filename) {
    // Remove extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    // Replace underscores and hyphens with spaces
    const nameWithSpaces = nameWithoutExt.replace(/[_-]/g, ' ');
    // Capitalize first letter of each word
    return nameWithSpaces.replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Generate product data
  const products = imageFiles.map((filename, index) => {
    const productName = generateProductName(filename);
    const imagePath = `/uploads/products/${filename}`;
    
    return {
      id: `prod-${String(index + 1).padStart(3, '0')}`,
      name_en: productName,
      name_hi: productName,
      slug: productName.toLowerCase().replace(/\s+/g, '-'),
      description_en: `Fresh ${productName} product from Lettex`,
      description_hi: `लेटेक्स से ताजा ${productName} उत्पाद`,
      price: Math.floor(Math.random() * 500) + 50, // Random price between 50-550
      original_price: Math.floor(Math.random() * 600) + 100, // Random original price
      stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
      category_id: 'cat-001', // Default to Grocery category
      image_path: imagePath,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    };
  });
  
  console.log(`Generated ${products.length} products`);
  
  // Save products data
  fs.writeFileSync(
    path.join(__dirname, 'lettex-products.json'),
    JSON.stringify(products, null, 2)
  );
  
  console.log('✅ Products data saved to lettex-products.json');
  
  // Generate seed code
  let seedCode = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('Seeding Lettex products...');
  
  // Delete existing products
  await prisma.product.deleteMany({});
  console.log('Deleted existing products');
  
  // Insert new products
  const products = [
`;
  
  products.forEach((product, index) => {
    seedCode += `    {
      id: '${product.id}',
      name_en: '${product.name_en}',
      name_hi: '${product.name_hi}',
      slug: '${product.slug}',
      description_en: '${product.description_en}',
      description_hi: '${product.description_hi}',
      price: ${product.price},
      original_price: ${product.original_price},
      stock: ${product.stock},
      category_id: '${product.category_id}',
      image_path: '${product.image_path}',
      is_active: ${product.is_active},
      created_at: new Date('${product.created_at.toISOString()}'),
      updated_at: new Date('${product.updated_at.toISOString()}')
    }${index < products.length - 1 ? ',' : ''}
`;
  });
  
  seedCode += `  ];
  
  for (const productData of products) {
    try {
      const product = await prisma.product.create({
        data: productData
      });
      console.log('Created product:', product.name_en);
    } catch (error) {
      console.error('Error creating product:', error.message);
    }
  }
  
  console.log('Product seeding completed!');
}

seedProducts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
  
  fs.writeFileSync(
    path.join(__dirname, 'seed-lettex-products.ts'),
    seedCode
  );
  
  console.log('✅ Product seed script saved to seed-lettex-products.ts');
  
} catch (error) {
  console.log('Error generating products:', error.message);
}

console.log('\n✅ All fixes completed!');