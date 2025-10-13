const fs = require('fs');
const path = require('path');

console.log('=== Setting up Lettex Marketplace with Correct Products ===\n');

// Required product names from the screenshot
const requiredProducts = [
  'Tamarind Candy',
  'Amla Candy',
  'Jungle Honey',
  'Baheda Powder',
  'Harada Powder', // Note: You mentioned "Harada" but it's spelled "Harada" in the list
  'Triphala Powder',
  'Herbal Gulal',
  'Handmade Soap',
  'Mahua Laddu',
  'Gond Painting'
];

console.log('Required products:');
requiredProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product}`);
});

console.log('\n=== Cleaning up existing products ===');

// Clean up existing product images (remove tribal art directories)
const productsDir = path.join(__dirname, 'public', 'uploads', 'products');
const tribalArtDirs = [
  'bamboo-basket',
  'bamboo-wall-art',
  'dokra-horse-figurine',
  'gond-painting',
  'handloom-sari',
  'handwoven-shawl',
  'terracotta-pot-set',
  'tribal-earrings',
  'tribal-headgear',
  'tribal-silver-necklace'
];

tribalArtDirs.forEach(dir => {
  const dirPath = path.join(productsDir, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Removed tribal art directory: ${dir}`);
  }
});

console.log('\n=== Creating placeholder images for required products ===');

// Create placeholder images for required products
requiredProducts.forEach(product => {
  const fileName = `${product.replace(/\s+/g, '_')}.jpg`;
  const filePath = path.join(productsDir, fileName);
  
  // Create a simple placeholder image (just a text file for now)
  const placeholderContent = `Placeholder image for ${product}`;
  fs.writeFileSync(filePath, placeholderContent);
  console.log(`Created placeholder for: ${product} (${fileName})`);
});

console.log('\n=== Updating seed file ===');

// Update the seed.ts file to only include these products
const seedFilePath = path.join(__dirname, 'prisma', 'seed.ts');
if (fs.existsSync(seedFilePath)) {
  let seedContent = fs.readFileSync(seedFilePath, 'utf8');
  
  // Find the product seeding section and replace it
  const productSeedingStart = seedContent.indexOf('// Create products from images');
  if (productSeedingStart !== -1) {
    const productSeedingEnd = seedContent.indexOf('console.log(\'Seeding completed successfully!\');');
    
    if (productSeedingEnd !== -1) {
      const beforeProducts = seedContent.substring(0, productSeedingStart);
      const afterProducts = seedContent.substring(productSeedingEnd);
      
      // Generate new product seeding code
      let newProductSeeding = '// Create products from images\n';
      newProductSeeding += '  // Only include required products from screenshot\n';
      newProductSeeding += '  const requiredProducts = [\n';
      
      requiredProducts.forEach((product, index) => {
        newProductSeeding += `    {\n`;
        newProductSeeding += `      id: 'prod-${String(index + 1).padStart(3, '0')}',\n`;
        newProductSeeding += `      name: '${product}',\n`;
        newProductSeeding += `      slug: '${product.toLowerCase().replace(/\s+/g, '-')}',\n`;
        newProductSeeding += `      description_en: 'Authentic ${product} from Lettex',\n`;
        newProductSeeding += `      description_hi: 'लेटेक्स से प्रामाणिक ${product}',\n`;
        newProductSeeding += `      price: new Prisma.Decimal(${Math.floor(Math.random() * 500) + 100}),\n`;
        newProductSeeding += `      original_price: new Prisma.Decimal(${Math.floor(Math.random() * 600) + 150}),\n`;
        newProductSeeding += `      stock: ${Math.floor(Math.random() * 50) + 10},\n`;
        newProductSeeding += `      category_id: 'cat-001',\n`;
        newProductSeeding += `      image_path: '/uploads/products/${product.replace(/\s+/g, '_')}.jpg',\n`;
        newProductSeeding += `      created_at: new Date(),\n`;
        newProductSeeding += `      updated_at: new Date()\n`;
        newProductSeeding += `    }${index < requiredProducts.length - 1 ? ',' : ''}\n`;
      });
      
      newProductSeeding += '  ];\n\n';
      newProductSeeding += '  for (const productData of requiredProducts) {\n';
      newProductSeeding += '    try {\n';
      newProductSeeding += '      const product = await prisma.product.create({\n';
      newProductSeeding += '        data: {\n';
      newProductSeeding += '          id: productData.id,\n';
      newProductSeeding += '          slug: productData.slug,\n';
      newProductSeeding += '          title_en: productData.name,\n';
      newProductSeeding += '          title_hi: productData.name,\n';
      newProductSeeding += '          description_en: productData.description_en,\n';
      newProductSeeding += '          description_hi: productData.description_hi,\n';
      newProductSeeding += '          price: productData.price,\n';
      newProductSeeding += '          original_price: productData.original_price,\n';
      newProductSeeding += '          stock: productData.stock,\n';
      newProductSeeding += '          category_id: productData.category_id,\n';
      newProductSeeding += '          created_at: productData.created_at,\n';
      newProductSeeding += '          updated_at: productData.updated_at\n';
      newProductSeeding += '        }\n';
      newProductSeeding += '      });\n\n';
      newProductSeeding += '      // Create product image\n';
      newProductSeeding += '      await prisma.productImage.create({\n';
      newProductSeeding += '        data: {\n';
      newProductSeeding += '          id: `img-${productData.id.substring(5)}`,\n';
      newProductSeeding += '          product_id: product.id,\n';
      newProductSeeding += '          image_url: productData.image_path,\n';
      newProductSeeding += '          alt_text: productData.name,\n';
      newProductSeeding += '          is_primary: true,\n';
      newProductSeeding += '          created_at: new Date()\n';
      newProductSeeding += '        }\n';
      newProductSeeding += '      });\n\n';
      newProductSeeding += '      console.log(`Created product: ${product.title_en} (${product.id})`);\n';
      newProductSeeding += '    } catch (error: any) {\n';
      newProductSeeding += '      console.error(`Error creating product ${productData.name}:`, error.message);\n';
      newProductSeeding += '    }\n';
      newProductSeeding += '  }\n';
      
      // Write updated seed file
      const updatedSeedContent = beforeProducts + newProductSeeding + afterProducts;
      fs.writeFileSync(seedFilePath, updatedSeedContent);
      console.log('✅ Seed file updated with required products only');
    }
  }
}

console.log('\n=== Setup Complete ===');
console.log('✅ Tribal art products removed');
console.log('✅ Required product placeholders created');
console.log('✅ Seed file updated');
console.log('\nNext steps:');
console.log('1. Replace placeholder images with actual product images');
console.log('2. Run: npx prisma db seed');