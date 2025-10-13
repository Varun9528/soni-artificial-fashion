const fs = require('fs');
const path = require('path');

console.log('=== Lettex Marketplace Setup Verification ===\n');

// Check logo file
console.log('1. Checking logo file...');
const logoPath = path.join(__dirname, 'public', 'images', 'logo', 'lettex-logo.png');
if (fs.existsSync(logoPath)) {
  const stats = fs.statSync(logoPath);
  console.log(`   ✅ Logo file exists: ${stats.size} bytes`);
  if (stats.size > 0) {
    console.log('   ✅ Logo file has content');
  } else {
    console.log('   ⚠️  Logo file is empty - please copy the logo manually');
  }
} else {
  console.log('   ❌ Logo file not found - please copy the logo manually');
}

// Check products directory
console.log('\n2. Checking products directory...');
const productsDir = path.join(__dirname, 'public', 'uploads', 'products');
if (fs.existsSync(productsDir)) {
  const files = fs.readdirSync(productsDir);
  const imageFiles = files.filter(file => 
    file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp')
  );
  console.log(`   ✅ Products directory exists with ${imageFiles.length} images`);
  
  if (imageFiles.length > 0) {
    console.log('   Sample images found:');
    imageFiles.slice(0, 5).forEach(file => {
      console.log(`     - ${file}`);
    });
    if (imageFiles.length > 5) {
      console.log(`     ... and ${imageFiles.length - 5} more`);
    }
  }
} else {
  console.log('   ❌ Products directory not found');
}

// Check seed file
console.log('\n3. Checking seed file...');
const seedPath = path.join(__dirname, 'prisma', 'seed.ts');
if (fs.existsSync(seedPath)) {
  const seedContent = fs.readFileSync(seedPath, 'utf8');
  if (seedContent.includes('generateProductName')) {
    console.log('   ✅ Seed file updated with product generation logic');
  } else {
    console.log('   ⚠️  Seed file may not have product generation logic');
  }
} else {
  console.log('   ❌ Seed file not found');
}

console.log('\n=== Verification Complete ===');
console.log('\nNext steps:');
console.log('1. If logo file is empty or missing, manually copy it from:');
console.log('   C:\\Users\\hp\\Desktop\\pachmarhi\\public\\images\\logo\\lettex-logo.png');
console.log('   To:');
console.log('   C:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\public\\images\\logo\\lettex-logo.png');
console.log('\n2. Run the following command to seed products:');
console.log('   npx prisma db seed');