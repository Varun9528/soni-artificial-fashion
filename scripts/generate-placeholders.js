const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure directories exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Create a placeholder image with text
function createImagePlaceholder(filepath, width, height, text, bgColor = [200, 200, 200]) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = `rgb(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]})`;
  ctx.fillRect(0, 0, width, height);
  
  // Text
  ctx.fillStyle = 'rgb(50, 50, 50)';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Handle multi-line text
  const lines = text.split('\\n');
  const lineHeight = 30;
  const startY = (height - (lines.length - 1) * lineHeight) / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });
  
  // Ensure directory exists
  const dir = path.dirname(filepath);
  ensureDir(dir);
  
  // Save image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });
  fs.writeFileSync(filepath, buffer);
  console.log(`Created: ${filepath}`);
}

// Create hero images
const heroColors = [
  [255, 182, 83],
  [255, 138, 138],
  [173, 216, 255],
  [144, 238, 144],
  [255, 192, 203]
];

const heroTexts = [
  "Handmade Bamboo Crafts",
  "Traditional Gond Paintings", 
  "Authentic Tribal Jewelry",
  "Eco-Friendly Cane Products",
  "Handloom Sarees"
];

for (let i = 1; i <= 5; i++) {
  createImagePlaceholder(
    `public/images/hero/hero${i}.jpg`,
    1920,
    700,
    heroTexts[i-1],
    heroColors[i-1]
  );
}

// Create category images
const categories = [
  ["tribal-shirts", "Tribal Shirts", [255, 200, 150]],
  ["jewelry", "Jewelry", [255, 215, 0]],
  ["handloom-textiles", "Handloom Textiles", [255, 160, 122]],
  ["home-decor", "Home Décor", [221, 160, 221]],
  ["accessories", "Accessories", [152, 251, 152]],
  ["gifts-souvenirs", "Gifts & Souvenirs", [255, 182, 193]]
];

categories.forEach(([slug, name, color]) => {
  createImagePlaceholder(
    `public/images/categories/cat-${slug}.jpg`,
    400,
    400,
    name,
    color
  );
});

// Create artisan images
const artisans = [
  ["sarla", "Sarla Bai\\nPachmarhi", [255, 218, 185]],
  ["ramesh", "Ramesh Uikey\\nTamia", [222, 184, 135]],
  ["meera", "Meera Gond\\nPipariya", [250, 240, 230]]
];

artisans.forEach(([slug, name, color]) => {
  createImagePlaceholder(
    `public/images/artisans/arti-${slug}.jpg`,
    400,
    400,
    name,
    color
  );
});

// Create product images
const products = [
  "bamboo-wall-art",
  "handloom-sari", 
  "terracotta-necklace",
  "dokra-figurine",
  "tribal-printed-shirt",
  "cane-basket",
  "gond-painting",
  "brass-earrings"
];

products.forEach(product => {
  const productName = product.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  for (let i = 1; i <= 3; i++) {
    createImagePlaceholder(
      `public/images/products/${product}/img${i}.jpg`,
      800,
      800,
      `${productName}\\nImage ${i}`,
      [240, 230, 220]
    );
  }
});

console.log("All placeholder images created!");