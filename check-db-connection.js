// Load environment variables
require('dotenv').config({ path: '.env.production' });

const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306'),
};

console.log('Testing database connection with config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

async function testConnection() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Database connection successful!', rows);
    
    // Test banners query
    const [banners] = await connection.execute('SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order LIMIT 5');
    console.log('Active banners found:', banners.length);
    console.log('Banner data:', banners);
    
    // Test products query
    const [products] = await connection.execute('SELECT * FROM products WHERE is_active = 1 LIMIT 5');
    console.log('Active products found:', products.length);
    
    await connection.end();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

testConnection();