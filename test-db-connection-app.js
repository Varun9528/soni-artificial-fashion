// Test database connection using the same method as the application
require('dotenv').config({ path: '.env.production' });

// Simulate the database connection logic from server-db.ts
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  keepAliveInitialDelay: 0,
  enableKeepAlive: true
};

console.log('Testing application database connection with config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

async function testAppConnection() {
  let pool;
  
  try {
    // Create connection pool like in server-db.ts
    pool = mysql.createPool(dbConfig);
    
    // Test getting dashboard stats (like in health check)
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [artisanCount] = await pool.execute('SELECT COUNT(*) as count FROM artisans');
    
    console.log('Dashboard stats:');
    console.log('  Products:', productCount[0].count);
    console.log('  Orders:', orderCount[0].count);
    console.log('  Users:', userCount[0].count);
    console.log('  Artisans:', artisanCount[0].count);
    
    // Test getting banners
    const [banners] = await pool.execute('SELECT * FROM banners ORDER BY display_order');
    console.log('Banners found:', banners.length);
    banners.forEach((banner, index) => {
      console.log(`  ${index + 1}. ${banner.title_en} (${banner.is_active ? 'active' : 'inactive'})`);
    });
    
    // Test getting products
    const [products] = await pool.execute('SELECT * FROM products LIMIT 5');
    console.log('Products found:', products.length);
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title_en} - ₹${product.price}`);
    });
    
    // Test getting categories
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY display_order');
    console.log('Categories found:', categories.length);
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name_en} (${category.is_active ? 'active' : 'inactive'})`);
    });
    
    await pool.end();
    
    console.log('\n✅ Application database connection test successful!');
    console.log('All data is accessible and the application should work correctly.');
    
  } catch (error) {
    console.error('❌ Application database connection test failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    
    if (pool) {
      await pool.end();
    }
    
    process.exit(1);
  }
}

testAppConnection();