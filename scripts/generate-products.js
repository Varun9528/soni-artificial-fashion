const fs = require('fs');
const path = require('path');

// Product data extracted from filenames
const productData = [
  { name: 'Geevi Atta Bag Studio Shot', price: 45, category: 'grocery' },
  { name: 'Geevi BayLeaf Studio Product', price: 30, category: 'grocery' },
  { name: 'Geevi Besan Packet Product Shot', price: 55, category: 'grocery' },
  { name: 'Geevi Biscuits Studio Shot', price: 25, category: 'grocery' },
  { name: 'Geevi Butter Box Studio', price: 65, category: 'dairy' },
  { name: 'Geevi Butter Box Studio Shot', price: 60, category: 'dairy' },
  { name: 'Geevi Chana Packet Studio', price: 70, category: 'grocery' },
  { name: 'Geevi Cheese Slices Product Shot', price: 85, category: 'dairy' },
  { name: 'Geevi Chili Powder Studio Shot', price: 35, category: 'grocery' },
  { name: 'Geevi Cloves Packet Photography', price: 40, category: 'grocery' },
  { name: 'Geevi Coffee Pouch Studio Shot', price: 95, category: 'grocery' },
  { name: 'Geevi Coriander Powder Product Shot', price: 30, category: 'grocery' },
  { name: 'Geevi Cumin Packet Product Shot', price: 35, category: 'grocery' },
  { name: 'Geevi Curd Cup Product Shot', price: 25, category: 'dairy' },
  { name: 'Geevi Curd Tub Product Shot', price: 30, category: 'dairy' },
  { name: 'Geevi Ghee Product Shot', price: 120, category: 'dairy' },
  { name: 'Geevi Lentil Pouch Product Shot', price: 75, category: 'grocery' },
  { name: 'Geevi Maida Bag Product Shot', price: 40, category: 'grocery' },
  { name: 'Geevi Masoor Dal Packshot', price: 65, category: 'grocery' },
  { name: 'Geevi Milk Pack Studio', price: 20, category: 'dairy' },
  { name: 'Geevi Milk Tetra Pack', price: 18, category: 'dairy' },
  { name: 'Geevi Moong Dal Product Shot', price: 70, category: 'grocery' },
  { name: 'Geevi Mustard Oil Product Shot', price: 80, category: 'grocery' },
  { name: 'Geevi Mustard Seeds Product Shot', price: 45, category: 'grocery' },
  { name: 'Geevi Noodles Studio Shot', price: 35, category: 'grocery' },
  { name: 'Geevi Oil Bottle Product Shot', price: 90, category: 'grocery' },
  { name: 'Geevi Paneer Packet Studio', price: 55, category: 'dairy' },
  { name: 'Geevi Pepper Packet Product Shot (1)', price: 40, category: 'grocery' },
  { name: 'Geevi Pepper Packet Product Shot', price: 40, category: 'grocery' },
  { name: 'Geevi Pickle Jar Product Shot', price: 75, category: 'grocery' },
  { name: 'Geevi Premium Grocery Product Showcase', price: 150, category: 'grocery' },
  { name: 'Geevi Rajma Packet Studio', price: 65, category: 'grocery' },
  { name: 'Geevi Rice Bag Product Shot', price: 85, category: 'grocery' },
  { name: 'Geevi Rice Flour Studio', price: 50, category: 'grocery' },
  { name: 'Geevi Salt Packet Product Shot', price: 20, category: 'grocery' },
  { name: 'Geevi Sugar Packet Product Shot', price: 25, category: 'grocery' },
  { name: 'Geevi Tea Packet Studio', price: 60, category: 'grocery' },
  { name: 'Geevi Turmeric Powder Product Shot', price: 35, category: 'grocery' },
  { name: 'Geevi Urad Dal Product Shot', price: 70, category: 'grocery' }
];

// Function to generate slug from product name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to generate product ID
function generateProductId(name) {
  return 'prod-' + generateSlug(name).substring(0, 20);
}

// Generate products array
const products = productData.map((product, index) => {
  const slug = generateSlug(product.name);
  const id = generateProductId(product.name);
  
  return {
    id: id,
    slug: slug,
    title_en: product.name,
    title_hi: product.name, // You can add Hindi translations here
    description_en: `High quality ${product.name} from Lettex`,
    description_hi: `लेटेक्स से उच्च गुणवत्ता वाला ${product.name}`, // Hindi description
    price: product.price,
    original_price: Math.round(product.price * 1.2), // 20% higher original price
    sku: `GEEVI-${index + 1}`,
    stock: Math.floor(Math.random() * 100) + 20, // Random stock between 20-120
    material: 'Various',
    category_id: `cat-${product.category === 'grocery' ? '004' : '005'}`, // Grocery or Dairy
    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
    review_count: Math.floor(Math.random() * 50), // Random reviews
    view_count: Math.floor(Math.random() * 200), // Random views
    sales_count: Math.floor(Math.random() * 100), // Random sales
    tags: '["lettex", "premium", "quality"]',
    featured: Math.random() > 0.7, // 30% chance of being featured
    best_seller: Math.random() > 0.8, // 20% chance of being best seller
    is_active: true
  };
});

// Write products to JSON file
const outputPath = path.join(__dirname, 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

console.log(`Generated ${products.length} products and saved to ${outputPath}`);