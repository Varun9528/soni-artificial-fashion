const fs = require('fs');
const path = require('path');

const tribalDirs = [
  'bamboo-lamp',
  'bamboo-wall-art',
  'brass-earrings',
  'cane-basket',
  'dokra-figurine',
  'folk-doll',
  'gond-painting',
  'hand-carved-plate',
  'handloom-sari',
  'terracotta-necklace',
  'tribal-cushion',
  'tribal-printed-shirt',
  'warli-art'
];

const productsPath = path.join(__dirname, 'public', 'images', 'products');

console.log('Removing tribal art directories...');

tribalDirs.forEach(dir => {
  const dirPath = path.join(productsPath, dir);
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Removed ${dir}`);
    } catch (err) {
      console.log(`❌ Failed to remove ${dir}: ${err.message}`);
    }
  } else {
    console.log(`ℹ️  ${dir} not found`);
  }
});

console.log('Cleanup completed.');