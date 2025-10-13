// Test script to verify all fixes
const fs = require('fs');
const path = require('path');

console.log('=== Lettex Marketplace Fix Verification ===\n');

// 1. Check if logo file exists with correct name
console.log('1. Checking logo file...');
const logoPath = 'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\public\\images\\logo\\lettex-logo.png';
if (fs.existsSync(logoPath)) {
  const stats = fs.statSync(logoPath);
  console.log(`   ✓ Logo file exists: ${logoPath} (${stats.size} bytes)`);
} else {
  console.log(`   ✗ Logo file not found: ${logoPath}`);
}

// 2. Check if product images exist
console.log('\n2. Checking product images...');
const productImagesPath = 'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\public\\uploads\\products';
if (fs.existsSync(productImagesPath)) {
  const files = fs.readdirSync(productImagesPath);
  console.log(`   ✓ Product images directory exists with ${files.length} files`);
  if (files.length > 0) {
    console.log(`   ✓ Sample files: ${files.slice(0, 3).join(', ')}`);
  }
} else {
  console.log(`   ✗ Product images directory not found: ${productImagesPath}`);
}

// 3. Check if components use safe title access
console.log('\n3. Checking component safety...');
const componentFiles = [
  'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\src\\components\\product\\ProductCard.tsx',
  'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\src\\app\\page.tsx',
  'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\src\\app\\search\\page.tsx',
  'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\src\\app\\product\\[slug]\\page.tsx'
];

const safeAccessPattern = /product\.title\?\.\[language\]/;

componentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (safeAccessPattern.test(content)) {
      console.log(`   ✓ ${path.basename(file)} uses safe title access`);
    } else {
      console.log(`   ? ${path.basename(file)} may need checking`);
    }
  } else {
    console.log(`   ✗ ${path.basename(file)} not found`);
  }
});

// 4. Check if seed file exists
console.log('\n4. Checking seed file...');
const seedPath = 'c:\\Users\\hp\\Desktop\\pachmarhi\\pachmarhi-marketplace\\prisma\\seed.ts';
if (fs.existsSync(seedPath)) {
  const content = fs.readFileSync(seedPath, 'utf8');
  if (content.includes('Lettex')) {
    console.log('   ✓ Seed file exists and contains Lettex references');
  } else {
    console.log('   ? Seed file exists but may need updating');
  }
} else {
  console.log('   ✗ Seed file not found');
}

console.log('\n=== Verification Complete ===');