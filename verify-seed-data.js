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

console.log('Verifying seed data in database...');

async function verifyData() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Check users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('Users count:', users[0].count);
    
    // Check admin user
    const [adminUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', ['admin@soniartificialfashion.com']);
    console.log('Admin user exists:', adminUsers.length > 0);
    if (adminUsers.length > 0) {
      console.log('Admin user details:', {
        email: adminUsers[0].email,
        role: adminUsers[0].role
      });
    }
    
    // Check categories
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log('Categories count:', categories[0].count);
    
    // Check products
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log('Products count:', products[0].count);
    
    // Check banners
    const [banners] = await connection.execute('SELECT COUNT(*) as count FROM banners');
    console.log('Banners count:', banners[0].count);
    
    // Check artisans
    const [artisans] = await connection.execute('SELECT COUNT(*) as count FROM artisans');
    console.log('Artisans count:', artisans[0].count);
    
    await connection.end();
    
    console.log('Data verification completed successfully!');
  } catch (error) {
    console.error('Data verification failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

verifyData();