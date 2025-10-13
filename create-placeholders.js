const fs = require('fs');
const path = require('path');

// Required product names
const requiredProducts = [
  'Tamarind Candy',
  'Amla Candy',
  'Jungle Honey',
  'Baheda Powder',
  'Harada Powder',
  'Triphala Powder',
  'Herbal Gulal',
  'Handmade Soap',
  'Mahua Laddu',
  'Gond Painting'
];

console.log('Creating placeholder images for required products...');

const productsDir = path.join(__dirname, 'public', 'uploads', 'products');

// Create placeholder images
requiredProducts.forEach(product => {
  const fileName = `${product.replace(/\s+/g, '_')}.jpg`;
  const filePath = path.join(productsDir, fileName);
  
  // Create a simple placeholder image (just a text file for now)
  const placeholderContent = `Placeholder image for ${product}`;
  fs.writeFileSync(filePath, placeholderContent);
  console.log(`Created placeholder for: ${product} (${fileName})`);
});

console.log('✅ All placeholder images created successfully!');