const fs = require('fs');
const path = require('path');

// Function to generate product name from filename
function generateProductName(filename) {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  // Replace underscores and hyphens with spaces
  const nameWithSpaces = nameWithoutExt.replace(/[_-]/g, ' ');
  // Capitalize first letter of each word
  return nameWithSpaces.replace(/\b\w/g, l => l.toUpperCase());
}

// Path to products directory
const productsDir = path.join(__dirname, 'public', 'uploads', 'products');

// Read all files in the products directory
fs.readdir(productsDir, (err, files) => {
  if (err) {
    console.error('Error reading products directory:', err);
    return;
  }

  // Filter out directories, keep only files
  const imageFiles = files.filter(file => {
    const fullPath = path.join(productsDir, file);
    return fs.statSync(fullPath).isFile() && !file.startsWith('.');
  });

  console.log('Found', imageFiles.length, 'product images');

  // Generate product data
  const products = imageFiles.map((filename, index) => {
    const productName = generateProductName(filename);
    const imagePath = `/uploads/products/${filename}`;
    
    return {
      id: `prod-${String(index + 1).padStart(3, '0')}`,
      name_en: productName,
      name_hi: productName, // For now, using same name for both languages
      slug: productName.toLowerCase().replace(/\s+/g, '-'),
      description_en: `Fresh ${productName} product`,
      description_hi: `ताजा ${productName} उत्पाद`,
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

  // Write to a JSON file for reference
  fs.writeFileSync(
    path.join(__dirname, 'generated-products.json'),
    JSON.stringify(products, null, 2)
  );

  console.log('Generated', products.length, 'products');
  console.log('Products saved to generated-products.json');

  // Also generate the seed code
  let seedCode = `// Generated product seed data
const products = [
`;

  products.forEach((product, index) => {
    seedCode += `  {
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
    created_at: new Date(),
    updated_at: new Date()
  }${index < products.length - 1 ? ',' : ''}
`;
  });

  seedCode += `];

module.exports = products;
`;

  fs.writeFileSync(
    path.join(__dirname, 'generated-products-seed.js'),
    seedCode
  );

  console.log('Seed code saved to generated-products-seed.js');
});