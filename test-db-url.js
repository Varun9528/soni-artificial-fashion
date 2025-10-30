require('dotenv').config({ path: '.env.production' });

const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection using individual environment variables...');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PORT:', process.env.DB_PORT);
    
    // Use individual environment variables instead of DATABASE_URL
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306')
    });
    
    console.log('✅ Database connection successful!');
    
    // Test a simple query to see if we can access the products table
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`✅ Found ${rows[0].count} products in the database`);
    
    await connection.end();
    
    console.log('\n🎉 Database connection is working properly!');
    console.log('Your products should now be visible on your website.');
    
  } catch (error) {
    console.log('❌ Database connection failed!');
    console.log('Error:', error.message);
  }
}

testDatabaseConnection();