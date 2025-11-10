const mysql = require('mysql2/promise');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function testProductInsert() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Try to insert a simple product
    const productQuery = `
      INSERT INTO products (id, slug, title, description, price, sku, stock, categoryId, artisanId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const productData = [
      'test-001',
      'test-product',
      'Test Product',
      'This is a test product',
      999,
      'TEST-001',
      10,
      'cat-001',
      'art-001'
    ];
    
    const result = await connection.execute(productQuery, productData);
    console.log('✅ Product inserted successfully:', result);
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Product insertion failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

testProductInsert();