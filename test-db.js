const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to count products
    const productCount = await prisma.product.count();
    console.log(`Current product count: ${productCount}`);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

async function testDatabase() {
  try {
    // Create connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      database: 'pachmarhi_marketplace_final'
    });
    
    console.log('✅ Database connection successful!');
    
    // Test query to check if tables exist
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('📋 Database tables:');
    rows.forEach(row => {
      console.log(`  - ${Object.values(row)[0]}`);
    });
    
    // Test query to check users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`\n👥 Users count: ${users[0].count}`);
    
    // Test query to check categories
    const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    console.log(`📂 Categories count: ${categories[0].count}`);
    
    // Test query to check artisans
    const [artisans] = await connection.execute('SELECT COUNT(*) as count FROM artisans');
    console.log(`🧑 Artisans count: ${artisans[0].count}`);
    
    // Test query to check products
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`🛍️ Products count: ${products[0].count}`);
    
    await connection.end();
    console.log('\n✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testDatabase();