const fs = require('fs');
const path = require('path');

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(path.join(__dirname, filePath));
  } catch (error) {
    return false;
  }
}

// Collection images to verify
const collectionImages = {
  "Men's Collection Images": [
    '/public/images/men collection/Gold_Figaro_Bracelet_Studio_Shot.png',
    '/public/images/men collection/Indian_Man_Gold_Chain.png',
    '/public/images/men collection/Indian_Man_Gold_Jewelry_Portrait.png',
    '/public/images/men collection/Indian_Man_Gold_Pendant_Portrait.png',
    '/public/images/men collection/Indian_Man_Ring_Macro.png'
  ],
  "Women's Collection Images": [
    '/public/images/women collection/Golden_Bangles_Radiant_Arm_Macro.png',
    '/public/images/women collection/Golden_Glamour_Wrist.png',
    '/public/images/women collection/Golden_Radiance_Portrait.png',
    '/public/images/women collection/Golden_Ring_South_Asian_Hand.png',
    '/public/images/women collection/Radiant_South_Asian_Elegance.png',
    '/public/images/women collection/South_Asian_Luxury_Bracelet_Close-up.png'
  ],
  "Product Images": [
    '/public/images/products/placeholder.jpg',
    '/public/images/mens product/Soni_Gold_Chain_Watermark.png',
    '/public/images/women collection/Golden_Radiance_Portrait.png'
  ],
  "Banner Images": [
    '/public/images/banner/banner1.png',
    '/public/images/banner/banner2.png',
    '/public/images/banner/banner3.png',
    '/public/images/banner/test-banner.png',
    '/public/images/banner/test-banner-mobile.png'
  ],
  "Category Images": [
    '/public/images/categories/jewelry.jpg',
    '/public/images/categories/necklaces.jpg',
    '/public/images/categories/earrings.jpg',
    '/public/images/categories/bracelets.jpg',
    '/public/images/categories/rings.jpg',
    '/public/images/categories/cat-006.jpg',
    '/public/images/categories/cat-007.jpg'
  ]
};

console.log('🔍 Verifying Collection Images...\n');

let totalFiles = 0;
let missingFiles = 0;

// Check each category
for (const [category, images] of Object.entries(collectionImages)) {
  console.log(`📁 ${category}:`);
  let categoryTotal = 0;
  let categoryMissing = 0;
  
  for (const image of images) {
    totalFiles++;
    categoryTotal++;
    
    if (fileExists(image)) {
      console.log(`   ✅ ${path.basename(image)}`);
    } else {
      console.log(`   ❌ ${path.basename(image)} (MISSING)`);
      missingFiles++;
      categoryMissing++;
    }
  }
  
  console.log(`   Status: ${categoryTotal - categoryMissing}/${categoryTotal} files present\n`);
}

console.log(`📊 Summary:`);
console.log(`   Total files checked: ${totalFiles}`);
console.log(`   Files found: ${totalFiles - missingFiles}`);
console.log(`   Files missing: ${missingFiles}`);

if (missingFiles === 0) {
  console.log(`\n🎉 All collection images are present and accounted for!`);
} else {
  console.log(`\n⚠️  ${missingFiles} files are missing. Please address these issues.`);
}