const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function checkProducts() {
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Get total product count
    const [countResult] = await pool.execute('SELECT COUNT(*) as count FROM products');
    console.log(`Total products in database: ${countResult[0].count}`);
    
    // Get first 5 products
    const [products] = await pool.execute('SELECT * FROM products LIMIT 5');
    
    console.log('\nFirst 5 products in database:');
    console.log('============================');
    products.forEach(product => {
      console.log(`ID: ${product.id}`);
      console.log(`Title (EN): ${product.title_en}`);
      console.log(`Category ID: ${product.category_id}`);
      console.log(`Featured: ${product.featured}`);
      console.log(`Best Seller: ${product.best_seller}`);
      console.log(`New Arrival: ${product.new_arrival}`);
      console.log(`-------------------`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProducts();