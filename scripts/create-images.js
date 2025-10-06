#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple placeholder image generator using Base64 data
function createPlaceholderImage(width, height, text, color = '#f59e0b') {
  // Minimal SVG that browsers can display
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  
  return Buffer.from(svg);
}

// Create directories and images
const imageStructure = {
  'hero': [
    { name: 'hero1.jpg', text: 'Tribal Art', width: 1200, height: 600 },
    { name: 'hero2.jpg', text: 'Handloom', width: 1200, height: 600 },
    { name: 'hero3.jpg', text: 'Festival', width: 1200, height: 600 },
    { name: 'hero4.jpg', text: 'Artisans', width: 1200, height: 600 },
    { name: 'hero5.jpg', text: 'Heritage', width: 1200, height: 600 }
  ],
  'categories': [
    { name: 'cat-home-decor.jpg', text: 'Home Decor', width: 400, height: 300 },
    { name: 'cat-handloom-textiles.jpg', text: 'Textiles', width: 400, height: 300 },
    { name: 'cat-jewelry.jpg', text: 'Jewelry', width: 400, height: 300 },
    { name: 'cat-tribal-shirts.jpg', text: 'Shirts', width: 400, height: 300 },
    { name: 'cat-accessories.jpg', text: 'Accessories', width: 400, height: 300 },
    { name: 'cat-art-paintings.jpg', text: 'Art & Paintings', width: 400, height: 300 }
  ],
  'artisans': [
    { name: 'arti-sarla-bai.jpg', text: 'Sarla Bai', width: 300, height: 300 },
    { name: 'arti-meera-gond.jpg', text: 'Meera Gond', width: 300, height: 300 },
    { name: 'arti-ramesh-uikey.jpg', text: 'Ramesh Uikey', width: 300, height: 300 }
  ]
};

// Product images
const products = [
  'bamboo-wall-art', 'handloom-sari', 'terracotta-necklace', 'dokra-figurine',
  'tribal-printed-shirt', 'cane-basket', 'gond-painting', 'warli-art'
];

const baseDir = path.join(__dirname, '../public/images');

console.log('Creating placeholder images...');

// Create category and static images
Object.entries(imageStructure).forEach(([folder, images]) => {
  const folderPath = path.join(baseDir, folder);
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  images.forEach(img => {
    const imagePath = path.join(folderPath, img.name);
    const svgContent = createPlaceholderImage(img.width, img.height, img.text);
    fs.writeFileSync(imagePath, svgContent);
    console.log(`Created: ${img.name} (${img.width}x${img.height})`);
  });
});

// Create product images
products.forEach(productSlug => {
  const productDir = path.join(baseDir, 'products', productSlug);
  
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }
  
  // Create 3-5 images per product
  for (let i = 1; i <= 4; i++) {
    const imagePath = path.join(productDir, `img${i}.jpg`);
    const productName = productSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const svgContent = createPlaceholderImage(500, 500, `${productName} ${i}`, '#f59e0b');
    fs.writeFileSync(imagePath, svgContent);
    console.log(`Created: products/${productSlug}/img${i}.jpg`);
  }
});

// Create some icon placeholders
const iconDir = path.join(baseDir, 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
iconSizes.forEach(size => {
  const iconPath = path.join(iconDir, `icon-${size}x${size}.png`);
  const svgContent = createPlaceholderImage(size, size, 'PA', '#f59e0b');
  fs.writeFileSync(iconPath, svgContent);
  console.log(`Created: icon-${size}x${size}.png`);
});

// Create other required images
const otherImages = [
  { dir: 'returns', name: 'sample1.jpg', text: 'Return Sample', width: 400, height: 300 },
  { dir: 'screenshots', name: 'desktop-1.png', text: 'Desktop View', width: 1280, height: 720 },
  { dir: 'screenshots', name: 'mobile-1.png', text: 'Mobile View', width: 360, height: 640 }
];

otherImages.forEach(img => {
  const imgDir = path.join(baseDir, img.dir);
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true });
  }
  
  const imagePath = path.join(imgDir, img.name);
  const svgContent = createPlaceholderImage(img.width, img.height, img.text);
  fs.writeFileSync(imagePath, svgContent);
  console.log(`Created: ${img.dir}/${img.name}`);
});

console.log('\n✅ All placeholder images created successfully!');
console.log('📝 Note: These are SVG-based placeholders that browsers can display.');
console.log('🎨 For production, replace with actual product photos.');