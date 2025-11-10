const mysql = require('mysql2/promise');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function createMoreProducts() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Create more products
    const products = [
      [
        'prod-003',
        'geometric-bracelet',
        JSON.stringify({en: 'Geometric Bracelet', hi: 'जियोमेट्रिक ब्रेसलेट'}),
        JSON.stringify({en: 'Modern geometric design gold-plated bracelet', hi: 'आधुनिक ज्यामितीय डिज़ाइन सोने की प्लेटेड कंघाई'}),
        1299,
        1799,
        'SKU-003',
        20,
        'cat-002', // categoryId
        'art-002'  // artisanId
      ],
      [
        'prod-004',
        'diamond-ring',
        JSON.stringify({en: 'Diamond Ring', hi: 'डायमंड रिंग'}),
        JSON.stringify({en: 'Elegant diamond-studded gold ring', hi: 'सुरुचिपूर्ण हीरा जड़ित सोने की अंगूठी'}),
        3499,
        4999,
        'SKU-004',
        10,
        'cat-002', // categoryId
        'art-001'  // artisanId
      ]
    ];
    
    for (const product of products) {
      try {
        // Check if product already exists
        const [existing] = await connection.execute('SELECT id FROM products WHERE id = ?', [product[0]]);
        
        if (existing.length === 0) {
          const productQuery = `
            INSERT INTO products (id, slug, title, description, price, originalPrice, sku, stock, categoryId, artisanId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `;
          await connection.execute(productQuery, product);
          console.log(`✅ Created product: ${JSON.parse(product[2]).en}`);
          
          // Create product image
          const imageQuery = `
            INSERT INTO product_images (id, productId, url, isPrimary, sortOrder, createdAt)
            VALUES (?, ?, ?, ?, ?, NOW())
          `;
          await connection.execute(imageQuery, [`img-${product[0].substring(5)}`, product[0], `/images/products/${product[0]}.png`, 1, 0]);
          console.log(`✅ Created product image for: ${JSON.parse(product[2]).en}`);
        } else {
          console.log(`Product already exists: ${product[0]}`);
        }
      } catch (error) {
        console.log(`Error creating product ${product[0]}:`, error.message);
      }
    }
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Product creation failed:');
    console.error('Error message:', error.message);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

createMoreProducts();