const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function checkCategories() {
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Get all categories
    const [rows] = await pool.execute('SELECT * FROM categories');
    
    console.log('Categories in database:');
    console.log('====================');
    rows.forEach(category => {
      console.log(`ID: ${category.id}`);
      console.log(`Name (EN): ${category.name_en}`);
      console.log(`Name (HI): ${category.name_hi}`);
      console.log(`-------------------`);
    });
    
    // Get products for cat-001
    const [products] = await pool.execute('SELECT * FROM products WHERE category_id = ?', ['cat-001']);
    
    console.log('\nProducts in category cat-001:');
    console.log('============================');
    products.forEach(product => {
      console.log(`ID: ${product.id}`);
      console.log(`Title (EN): ${product.title_en}`);
      console.log(`-------------------`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCategories();