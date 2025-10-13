const fs = require('fs');
const path = require('path');

// List of tribal art directories to remove
const tribalArtDirs = [
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

const productsDir = path.join(__dirname, 'public', 'images', 'products');

console.log('Checking for tribal art directories...');

tribalArtDirs.forEach(dir => {
  const fullPath = path.join(productsDir, dir);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Removed: ${dir}`);
    } catch (error) {
      console.log(`Failed to remove: ${dir} - ${error.message}`);
    }
  }
});

console.log('Cleanup complete.');