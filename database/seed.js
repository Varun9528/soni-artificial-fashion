#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// For demo purposes, this script outputs SQL INSERT statements
// In a real app, you'd connect to your actual database

const seedData = {
  // Sample artisans
  artisans: [
    {
      id: 'sarla-bai',
      name: 'Sarla Bai',
      bio_en: 'Master artisan specializing in Gond art with over 20 years of experience. Sarla creates intricate patterns inspired by nature and tribal folklore.',
      bio_hi: 'गोंड कला में विशेषज्ञता रखने वाली मास्टर कारीगर, 20 से अधिक वर्षों का अनुभव। सरला प्रकृति और जनजातीय लोककथाओं से प्रेरित जटिल पैटर्न बनाती हैं।',
      specialization: 'Gond Art, Traditional Paintings',
      location: 'Pachmarhi, Madhya Pradesh',
      phone: '+91 9876543210',
      email: 'sarla@pachmarhi.com',
      avatar: '/images/artisans/arti-sarla-bai.jpg',
      experience_years: 20,
      rating: 4.8,
      is_verified: true
    },
    {
      id: 'meera-gond',
      name: 'Meera Gond',
      bio_en: 'Skilled weaver and textile artist known for creating beautiful handloom fabrics using traditional techniques passed down through generations.',
      bio_hi: 'कुशल बुनकर और वस्त्र कलाकार जो पीढ़ियों से चली आ रही पारंपरिक तकनीकों का उपयोग करके सुंदर हैंडलूम कपड़े बनाने के लिए जानी जाती हैं।',
      specialization: 'Handloom Weaving, Textiles',
      location: 'Pachmarhi, Madhya Pradesh',
      phone: '+91 9876543211',
      email: 'meera@pachmarhi.com',
      avatar: '/images/artisans/arti-meera-gond.jpg',
      experience_years: 15,
      rating: 4.7,
      is_verified: true
    },
    {
      id: 'ramesh-uikey',
      name: 'Ramesh Uikey',
      bio_en: 'Expert craftsman specializing in Dokra metal work and terracotta pottery. His pieces reflect the rich cultural heritage of tribal art.',
      bio_hi: 'डोकरा धातु कार्य और टेराकोटा मिट्टी के बर्तन में विशेषज्ञता रखने वाले विशेषज्ञ शिल्पकार। उनके टुकड़े जनजातीय कला की समृद्ध सांस्कृतिक विरासत को दर्शाते हैं।',
      specialization: 'Dokra Art, Terracotta',
      location: 'Pachmarhi, Madhya Pradesh',
      phone: '+91 9876543212',
      email: 'ramesh@pachmarhi.com',
      avatar: '/images/artisans/arti-ramesh-uikey.jpg',
      experience_years: 18,
      rating: 4.9,
      is_verified: true
    }
  ],

  // Sample banners
  banners: [
    {
      title_en: 'Authentic Tribal Art',
      title_hi: 'प्रामाणिक जनजातीय कला',
      subtitle_en: 'Discover the Beauty of Pachmarhi',
      subtitle_hi: 'पचमढ़ी की सुंदरता खोजें',
      description_en: 'Handcrafted with love by tribal artisans',
      description_hi: 'जनजातीय कारीगरों द्वारा प्रेम से हस्तनिर्मित',
      image_desktop: '/images/hero/hero1.jpg',
      link_url: '/category/home-decor',
      link_text_en: 'Shop Now',
      link_text_hi: 'अभी खरीदें',
      display_order: 1,
      is_active: true
    },
    {
      title_en: 'Handloom Textiles',
      title_hi: 'हैंडलूम वस्त्र',
      subtitle_en: 'Traditional Weaving Excellence',
      subtitle_hi: 'पारंपरिक बुनाई उत्कृष्टता',
      description_en: 'Premium quality handwoven fabrics',
      description_hi: 'प्रीमियम गुणवत्ता हाथ से बुने कपड़े',
      image_desktop: '/images/hero/hero2.jpg',
      link_url: '/category/handloom-textiles',
      link_text_en: 'Explore',
      link_text_hi: 'खोजें',
      display_order: 2,
      is_active: true
    },
    {
      title_en: 'Festive Collection',
      title_hi: 'त्योहारी संग्रह',
      subtitle_en: 'Special Occasion Pieces',
      subtitle_hi: 'विशेष अवसर के टुकड़े',
      description_en: 'Perfect for celebrations and gifts',
      description_hi: 'उत्सव और उपहार के लिए आदर्श',
      image_desktop: '/images/hero/hero3.jpg',
      link_url: '/category/jewelry',
      link_text_en: 'Shop Collection',
      link_text_hi: 'संग्रह खरीदें',
      display_order: 3,
      is_active: true
    }
  ],

  // Sample coupons
  coupons: [
    {
      code: 'WELCOME10',
      title: 'Welcome Offer',
      description: '10% off on first order',
      type: 'percentage',
      value: 10.00,
      minimum_order_amount: 500.00,
      maximum_discount_amount: 200.00,
      usage_limit: 1000,
      user_usage_limit: 1,
      valid_from: '2024-01-01 00:00:00',
      valid_until: '2024-12-31 23:59:59',
      is_active: true
    },
    {
      code: 'FREESHIP',
      title: 'Free Shipping',
      description: 'Free shipping on orders above ₹299',
      type: 'free_shipping',
      value: 0.00,
      minimum_order_amount: 299.00,
      usage_limit: null,
      user_usage_limit: 5,
      valid_from: '2024-01-01 00:00:00',
      valid_until: '2024-12-31 23:59:59',
      is_active: true
    },
    {
      code: 'TRIBAL50',
      title: 'Tribal Art Special',
      description: '₹50 off on tribal art items',
      type: 'fixed',
      value: 50.00,
      minimum_order_amount: 1000.00,
      usage_limit: 500,
      user_usage_limit: 2,
      valid_from: '2024-01-01 00:00:00',
      valid_until: '2024-12-31 23:59:59',
      applicable_categories: JSON.stringify(['home-decor', 'art-paintings']),
      is_active: true
    }
  ]
};

// Generate SQL INSERT statements
function generateInsertSQL(tableName, data) {
  if (!data || data.length === 0) return '';
  
  const columns = Object.keys(data[0]);
  const values = data.map(row => {
    const rowValues = columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) return 'NULL';
      if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
      if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
      return value;
    });
    return `(${rowValues.join(', ')})`;
  });
  
  return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n${values.join(',\n')};\n`;
}

// Create the seed SQL file
function createSeedFile() {
  let sql = `-- Pachmarhi Tribal Art Marketplace Seed Data\n`;
  sql += `-- Generated on ${new Date().toISOString()}\n\n`;
  
  sql += `-- Clear existing data (in reverse order of dependencies)\n`;
  sql += `DELETE FROM coupon_usage;\n`;
  sql += `DELETE FROM coupons;\n`;
  sql += `DELETE FROM banners;\n`;
  sql += `DELETE FROM artisans;\n\n`;

  // Add INSERT statements
  sql += generateInsertSQL('artisans', seedData.artisans);
  sql += generateInsertSQL('banners', seedData.banners);
  sql += generateInsertSQL('coupons', seedData.coupons);

  // Add some sample orders for demo
  sql += `-- Sample orders for demo\n`;
  sql += `INSERT INTO orders (id, order_number, user_id, status, payment_method, subtotal, total_amount, shipping_address, created_at) VALUES\n`;
  sql += `('order-001', 'ORD2024001', 'admin-001', 'delivered', 'cod', 2499.00, 2499.00, '{"fullName": "John Doe", "phone": "9876543210", "addressLine1": "123 Main St", "city": "Bhopal", "state": "Madhya Pradesh", "pincode": "462001"}', '2024-09-25 10:30:00'),\n`;
  sql += `('order-002', 'ORD2024002', 'admin-001', 'shipped', 'online', 1299.00, 1299.00, '{"fullName": "Jane Smith", "phone": "9876543211", "addressLine1": "456 Oak Ave", "city": "Indore", "state": "Madhya Pradesh", "pincode": "452001"}', '2024-09-28 14:15:00'),\n`;
  sql += `('order-003', 'ORD2024003', 'admin-001', 'processing', 'cod', 899.00, 939.00, '{"fullName": "Mike Johnson", "phone": "9876543212", "addressLine1": "789 Pine St", "city": "Jabalpur", "state": "Madhya Pradesh", "pincode": "482001"}', '2024-09-30 09:45:00');\n\n`;

  // Sample returns for demo
  sql += `-- Sample returns for demo\n`;
  sql += `INSERT INTO returns (id, order_id, order_item_id, user_id, reason, description, status, created_at) VALUES\n`;
  sql += `('return-001', 'order-001', 'item-001', 'admin-001', 'Damaged during shipping', 'Product arrived with scratches on the surface', 'requested', '2024-09-29 16:20:00'),\n`;
  sql += `('return-002', 'order-002', 'item-002', 'admin-001', 'Size issue', 'Product size is different from description', 'approved', '2024-09-29 11:30:00');\n\n`;

  // Update product counts and ratings
  sql += `-- Update product counts and ratings\n`;
  sql += `UPDATE products SET \n`;
  sql += `  review_count = FLOOR(RAND() * 50) + 5,\n`;
  sql += `  rating = ROUND(4.0 + (RAND() * 1.0), 1),\n`;
  sql += `  view_count = FLOOR(RAND() * 500) + 50,\n`;
  sql += `  sales_count = FLOOR(RAND() * 100) + 10\n`;
  sql += `WHERE id IN (SELECT id FROM products LIMIT 10);\n\n`;

  return sql;
}

// Write the seed file
const seedSQL = createSeedFile();
const outputPath = path.join(__dirname, 'seed.sql');
fs.writeFileSync(outputPath, seedSQL);

console.log('Seed SQL file generated:', outputPath);
console.log('To run the seed:');
console.log('1. For MySQL: mysql -u username -p database_name < seed.sql');
console.log('2. For PostgreSQL: psql -U username -d database_name -f seed.sql');
console.log('3. Or use your preferred database tool to execute the SQL statements');

// Also create a JSON version for reference
const jsonOutput = JSON.stringify(seedData, null, 2);
const jsonPath = path.join(__dirname, '../src/data/seed.json');
fs.writeFileSync(jsonPath, jsonOutput);
console.log('Seed JSON file created:', jsonPath);