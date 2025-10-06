const fs = require('fs');
const path = require('path');

// Function to create SVG image with text
function createSVGImage(text, width = 400, height = 300, bgColor = '#f3f4f6', textColor = '#374151') {
  const lines = text.split('\n');
  const lineHeight = 30;
  const startY = height / 2 - (lines.length * lineHeight) / 2 + lineHeight / 2;
  
  const textElements = lines.map((line, index) => 
    `<text x=\"${width/2}\" y=\"${startY + index * lineHeight}\" font-family=\"Arial, sans-serif\" font-size=\"16\" font-weight=\"bold\" fill=\"${textColor}\" text-anchor=\"middle\">${line}</text>`
  ).join('');
  
  return `<svg width=\"${width}\" height=\"${height}\" xmlns=\"http://www.w3.org/2000/svg\">
  <rect width=\"100%\" height=\"100%\" fill=\"${bgColor}\"/>
  ${textElements}
</svg>`;
}

// Create directories if they don't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Hero banners
const heroImages = [
  { file: 'hero1.jpg', text: 'Handmade Bamboo Crafts\nSustainable & Beautiful', bg: '#10b981' },
  { file: 'hero2.jpg', text: 'Traditional Gond Paintings\nColors of Pachmarhi', bg: '#f59e0b' },
  { file: 'hero3.jpg', text: 'Authentic Tribal Jewelry\nUnique Handcrafted Pieces', bg: '#8b5cf6' },
  { file: 'hero4.jpg', text: 'Eco-Friendly Cane Products\nStyle Meets Nature', bg: '#06b6d4' },
  { file: 'hero5.jpg', text: 'Handloom Sarees\nWeaves from Local Artisans', bg: '#ef4444' }
];

// Category images
const categoryImages = [
  { file: 'cat-tribal-shirts.jpg', text: 'Tribal Shirts\nAuthentic Prints', bg: '#3b82f6' },
  { file: 'cat-jewelry.jpg', text: 'Jewelry\nHandcrafted Pieces', bg: '#f59e0b' },
  { file: 'cat-handloom-textiles.jpg', text: 'Handloom Textiles\nTraditional Weaves', bg: '#8b5cf6' },
  { file: 'cat-home-decor.jpg', text: 'Home Décor\nArtistic Elements', bg: '#10b981' },
  { file: 'cat-accessories.jpg', text: 'Accessories\nFunctional Art', bg: '#ef4444' },
  { file: 'cat-gifts-souvenirs.jpg', text: 'Gifts & Souvenirs\nMemorable Pieces', bg: '#06b6d4' }
];

// Artisan images
const artisanImages = [
  { file: 'arti-sarla.jpg', text: 'Sarla Bai\nMaster Weaver', bg: '#f59e0b' },
  { file: 'arti-ramesh.jpg', text: 'Ramesh Uikey\nPottery Expert', bg: '#8b5cf6' },
  { file: 'arti-meera.jpg', text: 'Meera Gond\nGond Painter', bg: '#10b981' },
  { file: 'arti-raj.jpg', text: 'Raj Kumar\nBamboo Craftsman', bg: '#ef4444' }
];

// Product images
const productImages = {
  'bamboo-wall-art': [
    { file: 'img1.jpg', text: 'Bamboo Wall Art\nFront View', bg: '#10b981' },
    { file: 'img2.jpg', text: 'Bamboo Wall Art\nDetail Shot', bg: '#059669' },
    { file: 'img3.jpg', text: 'Bamboo Wall Art\nSide Angle', bg: '#047857' }
  ],
  'handloom-sari': [
    { file: 'img1.jpg', text: 'Handloom Sari\nFull Length', bg: '#f59e0b' },
    { file: 'img2.jpg', text: 'Handloom Sari\nPattern Detail', bg: '#d97706' },
    { file: 'img3.jpg', text: 'Handloom Sari\nBorder Design', bg: '#b45309' }
  ],
  'terracotta-necklace': [
    { file: 'img1.jpg', text: 'Terracotta Necklace\nFull View', bg: '#8b5cf6' },
    { file: 'img2.jpg', text: 'Terracotta Necklace\nDetail', bg: '#7c3aed' },
    { file: 'img3.jpg', text: 'Terracotta Necklace\nTexture', bg: '#6d28d9' }
  ],
  'dokra-figurine': [
    { file: 'img1.jpg', text: 'Dokra Figurine\nFront View', bg: '#ef4444' },
    { file: 'img2.jpg', text: 'Dokra Figurine\nSide Profile', bg: '#dc2626' },
    { file: 'img3.jpg', text: 'Dokra Figurine\nBack View', bg: '#b91c1c' }
  ],
  'tribal-printed-shirt': [
    { file: 'img1.jpg', text: 'Tribal Shirt\nFront Design', bg: '#3b82f6' },
    { file: 'img2.jpg', text: 'Tribal Shirt\nPattern Close-up', bg: '#2563eb' },
    { file: 'img3.jpg', text: 'Tribal Shirt\nBack View', bg: '#1d4ed8' }
  ],
  'cane-basket': [
    { file: 'img1.jpg', text: 'Cane Basket\nFull View', bg: '#06b6d4' },
    { file: 'img2.jpg', text: 'Cane Basket\nWeave Pattern', bg: '#0891b2' },
    { file: 'img3.jpg', text: 'Cane Basket\nHandle Detail', bg: '#0e7490' }
  ],
  'gond-painting': [
    { file: 'img1.jpg', text: 'Gond Painting\nFull Artwork', bg: '#10b981' },
    { file: 'img2.jpg', text: 'Gond Painting\nDetail Section', bg: '#059669' },
    { file: 'img3.jpg', text: 'Gond Painting\nColor Palette', bg: '#047857' }
  ],
  'brass-earrings': [
    { file: 'img1.jpg', text: 'Brass Earrings\nPair View', bg: '#f59e0b' },
    { file: 'img2.jpg', text: 'Brass Earrings\nSingle Piece', bg: '#d97706' },
    { file: 'img3.jpg', text: 'Brass Earrings\nTexture Detail', bg: '#b45309' }
  ],
  'hand-carved-plate': [
    { file: 'img1.jpg', text: 'Carved Plate\nTop View', bg: '#8b5cf6' },
    { file: 'img2.jpg', text: 'Carved Plate\nCarving Detail', bg: '#7c3aed' },
    { file: 'img3.jpg', text: 'Carved Plate\nSide Profile', bg: '#6d28d9' }
  ],
  'tribal-cushion': [
    { file: 'img1.jpg', text: 'Tribal Cushion\nFront Design', bg: '#ef4444' },
    { file: 'img2.jpg', text: 'Tribal Cushion\nPattern Detail', bg: '#dc2626' },
    { file: 'img3.jpg', text: 'Tribal Cushion\nBack View', bg: '#b91c1c' }
  ],
  'bamboo-lamp': [
    { file: 'img1.jpg', text: 'Bamboo Lamp\nFull View', bg: '#3b82f6' },
    { file: 'img2.jpg', text: 'Bamboo Lamp\nLit Effect', bg: '#2563eb' },
    { file: 'img3.jpg', text: 'Bamboo Lamp\nBase Detail', bg: '#1d4ed8' }
  ],
  'folk-doll': [
    { file: 'img1.jpg', text: 'Folk Doll\nFront View', bg: '#06b6d4' },
    { file: 'img2.jpg', text: 'Folk Doll\nCostume Detail', bg: '#0891b2' },
    { file: 'img3.jpg', text: 'Folk Doll\nSide Profile', bg: '#0e7490' }
  ]
};

const baseDir = path.join(__dirname, 'public', 'images');

// Create hero images
const heroDir = path.join(baseDir, 'hero');
ensureDir(heroDir);
heroImages.forEach(img => {
  const svg = createSVGImage(img.text, 1200, 600, img.bg, '#ffffff');
  fs.writeFileSync(path.join(heroDir, img.file), svg);
  console.log(`Created ${img.file}`);
});

// Create category images
const categoryDir = path.join(baseDir, 'categories');
ensureDir(categoryDir);
categoryImages.forEach(img => {
  const svg = createSVGImage(img.text, 400, 300, img.bg, '#ffffff');
  fs.writeFileSync(path.join(categoryDir, img.file), svg);
  console.log(`Created ${img.file}`);
});

// Create artisan images
const artisanDir = path.join(baseDir, 'artisans');
ensureDir(artisanDir);
artisanImages.forEach(img => {
  const svg = createSVGImage(img.text, 300, 300, img.bg, '#ffffff');
  fs.writeFileSync(path.join(artisanDir, img.file), svg);
  console.log(`Created ${img.file}`);
});

// Create product images
Object.keys(productImages).forEach(productSlug => {
  const productDir = path.join(baseDir, 'products', productSlug);
  ensureDir(productDir);
  
  productImages[productSlug].forEach(img => {
    const svg = createSVGImage(img.text, 500, 500, img.bg, '#ffffff');
    fs.writeFileSync(path.join(productDir, img.file), svg);
    console.log(`Created ${productSlug}/${img.file}`);
  });
});

console.log('\n✅ All dummy images created successfully!');
console.log('\n📁 Image structure:');
console.log('   /public/images/hero/ - 5 banner images');
console.log('   /public/images/categories/ - 6 category images');
console.log('   /public/images/artisans/ - 4 artisan photos');
console.log('   /public/images/products/ - 36 product images (12 products × 3 images each)');
console.log('\n🎨 All images are colorful SVGs with proper labels and dimensions.');