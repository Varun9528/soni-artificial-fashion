const fs = require('fs');
const path = require('path');

console.log('=== Verifying Product Images ===');

// Check products directory
const productsDir = path.join(__dirname, 'public', 'images', 'products');

if (fs.existsSync(productsDir)) {
  const files = fs.readdirSync(productsDir);
  
  // Filter out directories, keep only image files
  const imageFiles = files.filter(file => {
    const fullPath = path.join(productsDir, file);
    return fs.statSync(fullPath).isFile() && !file.startsWith('.') && 
           (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp'));
  });
  
  console.log(`Found ${imageFiles.length} product images in ${productsDir}`);
  
  // Show first 10 images
  console.log('\nFirst 10 product images:');
  imageFiles.slice(0, 10).forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  
  if (imageFiles.length > 10) {
    console.log(`... and ${imageFiles.length - 10} more`);
  }
  
  // Check if tribal art directories still exist
  const directories = files.filter(file => {
    const fullPath = path.join(productsDir, file);
    return fs.statSync(fullPath).isDirectory();
  });
  
  if (directories.length > 0) {
    console.log('\n⚠️  Found directories (may include tribal art):');
    directories.forEach(dir => {
      console.log(`  - ${dir}`);
    });
  } else {
    console.log('\n✅ No directories found in products folder');
  }
} else {
  console.log(`❌ Products directory not found: ${productsDir}`);
}

console.log('\n=== Verification Complete ===');
console.log('\nNext steps:');
console.log('1. Run: npm run seed');
console.log('2. Start the development server: npm run dev');
console.log('3. Visit http://localhost:3000/products to see the products');