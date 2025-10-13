const fs = require('fs');

console.log('Fixing image files...');

// Copy better images to replace the small placeholder ones
const imageFixes = [
  {
    source: 'public/images/categories/cat-handloom-textiles.jpg',
    target: 'public/images/categories/cat-wooden-carvings.jpg'
  },
  {
    source: 'public/images/categories/cat-handloom-textiles.jpg',
    target: 'public/images/categories/cat-tribal-paintings.jpg'
  },
  {
    source: 'public/images/artisans/arti-sarla.jpg',
    target: 'public/images/artisans/arti-sarla-bai.jpg'
  },
  {
    source: 'public/images/artisans/arti-ramesh.jpg',
    target: 'public/images/artisans/arti-ramesh-uikey.jpg'
  },
  {
    source: 'public/images/artisans/arti-meera.jpg',
    target: 'public/images/artisans/arti-meera-gond.jpg'
  }
];

imageFixes.forEach(({ source, target }) => {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target);
      console.log(`✅ Copied ${source} to ${target}`);
    } else {
      console.log(`❌ Source file not found: ${source}`);
    }
  } catch (error) {
    console.log(`❌ Error copying ${source} to ${target}: ${error.message}`);
  }
});

console.log('\n🎉 Image fix completed!');