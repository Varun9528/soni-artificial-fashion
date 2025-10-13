const fs = require('fs');

console.log('Checking image file sizes...\n');

const imagesToCheck = [
  'public/images/categories/cat-wooden-carvings.jpg',
  'public/images/categories/cat-tribal-paintings.jpg',
  'public/images/categories/cat-handwoven-textiles.jpg',
  'public/images/categories/cat-jewelry-accessories.jpg',
  'public/images/categories/cat-home-decor.jpg',
  'public/images/artisans/arti-sarla.jpg',
  'public/images/artisans/arti-ramesh.jpg',
  'public/images/artisans/arti-meera.jpg',
  'public/images/artisans/arti-raj.jpg'
];

imagesToCheck.forEach(imagePath => {
  try {
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      console.log(`✅ ${imagePath}: ${stats.size} bytes`);
    } else {
      console.log(`❌ ${imagePath}: File not found`);
    }
  } catch (error) {
    console.log(`❌ ${imagePath}: Error - ${error.message}`);
  }
});

console.log('\n🎉 Image check completed!');