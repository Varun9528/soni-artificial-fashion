// Check database connection and products
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function checkDatabase() {
  try {
    console.log('Connecting to database...');
    const pool = mysql.createPool(dbConfig);
    
    console.log('Checking products table...');
    const [products] = await pool.execute('SELECT * FROM products LIMIT 1');
    console.log('Products found:', products.length);
    
    if (products.length > 0) {
      console.log('First product:', products[0]);
    }
    
    console.log('Checking carts table...');
    const [carts] = await pool.execute('SELECT * FROM carts LIMIT 1');
    console.log('Cart items found:', carts.length);
    
    await pool.end();
    console.log('Database check completed successfully');
  } catch (error) {
    console.error('Database check failed:', error.message);
  }
}

checkDatabase();