const fs = require('fs');
const path = require('path');

// Create a simple SVG placeholder image
function createPlaceholderImage(width, height, text, color = '#f59e0b') {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  
  return svg;
}

// Create directories if they don't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Generate images for products
function generateProductImages() {
  const productNames = [
    'Bamboo Wall Art',
    'Handloom Sari',
    'Tribal Silver Necklace',
    'Gond Painting',
    'Terracotta Pot Set',
    'Tribal Earrings',
    'Bamboo Basket',
    'Handwoven Shawl',
    'Dokra Horse Figurine',
    'Tribal Headgear'
  ];
  
  productNames.forEach((productName, index) => {
    const productSlug = productName.toLowerCase().replace(/\s+/g, '-');
    const productDir = path.join('public', 'uploads', 'products', productSlug);
    ensureDir(productDir);
    
    // Create 3 images per product
    for (let i = 1; i <= 3; i++) {
      const imagePath = path.join(productDir, `img${i}.jpg`);
      const svgContent = createPlaceholderImage(500, 500, `${productName} ${i}`, `hsl(${index * 36}, 70%, 60%)`);
      fs.writeFileSync(imagePath, svgContent);
      console.log(`✅ Created: ${imagePath}`);
    }
  });
}

// Generate images for artisans
function generateArtisanImages() {
  const artisanNames = [
    'Ramesh Prajapati',
    'Sarla Bai',
    'Meera Gond',
    'Devendra Singh',
    'Kamala Devi'
  ];
  
  const artisanDir = path.join('public', 'uploads', 'artisans');
  ensureDir(artisanDir);
  
  artisanNames.forEach((artisanName, index) => {
    const imagePath = path.join(artisanDir, `${artisanName.toLowerCase().replace(/\s+/g, '-')}.jpg`);
    const svgContent = createPlaceholderImage(300, 300, artisanName, `hsl(${index * 72}, 60%, 50%)`);
    fs.writeFileSync(imagePath, svgContent);
    console.log(`✅ Created: ${imagePath}`);
  });
}

// Generate images for categories
function generateCategoryImages() {
  const categories = [
    { name: 'Jewelry', slug: 'jewelry' },
    { name: 'Home Decor', slug: 'home-decor' },
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'Art & Paintings', slug: 'art-paintings' }
  ];
  
  const categoryDir = path.join('public', 'uploads', 'categories');
  ensureDir(categoryDir);
  
  categories.forEach((category, index) => {
    const imagePath = path.join(categoryDir, `cat-${category.slug}.jpg`);
    const svgContent = createPlaceholderImage(400, 300, category.name, `hsl(${index * 72}, 80%, 40%)`);
    fs.writeFileSync(imagePath, svgContent);
    console.log(`✅ Created: ${imagePath}`);
  });
}

// Generate images for banners
function generateBannerImages() {
  const banners = [
    'Hero Banner 1',
    'Hero Banner 2',
    'Hero Banner 3'
  ];
  
  const bannerDir = path.join('public', 'uploads', 'banners');
  ensureDir(bannerDir);
  
  banners.forEach((bannerName, index) => {
    const imagePath = path.join(bannerDir, `hero${index + 1}.jpg`);
    const svgContent = createPlaceholderImage(1200, 400, bannerName, `hsl(${index * 120}, 70%, 50%)`);
    fs.writeFileSync(imagePath, svgContent);
    console.log(`✅ Created: ${imagePath}`);
  });
}

// Main function
function generateAllImages() {
  console.log('🎨 Generating placeholder images...');
  
  generateProductImages();
  generateArtisanImages();
  generateCategoryImages();
  generateBannerImages();
  
  console.log('✅ All placeholder images generated successfully!');
}

generateAllImages();