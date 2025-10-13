const fs = require('fs');
const path = require('path');

console.log('=== Cleaning up tribal art directories ===');

// Tribal art directories to remove
const tribalArtDirs = [
  'bamboo-basket',
  'bamboo-wall-art',
  'dokra-horse-figurine',
  'gond-painting',
  'handloom-sari',
  'handwoven-shawl',
  'terracotta-pot-set',
  'tribal-earrings',
  'tribal-headgear',
  'tribal-silver-necklace',
  'bamboo-lamp',
  'brass-earrings',
  'cane-basket',
  'dokra-figurine',
  'folk-doll',
  'hand-carved-plate',
  'terracotta-necklace',
  'tribal-cushion',
  'tribal-printed-shirt',
  'warli-art'
];

// Directories to clean
const directories = [
  path.join(__dirname, 'public', 'uploads', 'products'),
  path.join(__dirname, 'public', 'images', 'products')
];

directories.forEach(dir => {
  console.log(`\nCleaning directory: ${dir}`);
  
  if (fs.existsSync(dir)) {
    tribalArtDirs.forEach(tribalDir => {
      const fullPath = path.join(dir, tribalDir);
      if (fs.existsSync(fullPath)) {
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`  ✅ Removed: ${tribalDir}`);
        } catch (error) {
          console.log(`  ❌ Failed to remove: ${tribalDir} - ${error.message}`);
        }
      }
    });
  } else {
    console.log(`  Directory does not exist: ${dir}`);
  }
});

console.log('\n=== Cleanup complete ===');