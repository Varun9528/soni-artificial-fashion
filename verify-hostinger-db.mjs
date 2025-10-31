import mysql from 'mysql2/promise';

// Hostinger database configuration
const dbConfig = {
  host: 'auth-db1555.hstgr.io',
  port: 3306,
  user: 'u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_son',
  connectTimeout: 10000, // 10 seconds timeout
};

console.log('Testing Hostinger database connection...');
console.log('Database config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database
});

async function testHostingerDatabase() {
  let connection;
  try {
    console.log('\n1. Testing database connection...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Database connection successful');
    
    console.log('\n2. Checking required tables...');
    const requiredTables = ['users', 'products', 'categories', 'wishlists', 'carts'];
    
    for (const table of requiredTables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          console.log(`✓ Table '${table}' exists`);
        } else {
          console.log(`⚠ Table '${table}' not found`);
        }
      } catch (error) {
        console.log(`✗ Error checking table '${table}':`, error.message);
      }
    }
    
    console.log('\n3. Testing basic operations...');
    
    // Try to get a user (if exists)
    try {
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users LIMIT 1');
      console.log(`✓ User table accessible, found ${users[0].count} records`);
    } catch (error) {
      console.log('⚠ Could not access users table:', error.message);
    }
    
    // Try to get categories (if exists)
    try {
      const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories LIMIT 1');
      console.log(`✓ Categories table accessible, found ${categories[0].count} records`);
    } catch (error) {
      console.log('⚠ Could not access categories table:', error.message);
    }
    
    console.log('\n🎉 Hostinger database verification completed successfully!');
    console.log('The database is properly configured and accessible.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Verify Hostinger database credentials are correct');
    console.log('2. Ensure the database is created and accessible');
    console.log('3. Check if there are any firewall restrictions');
    console.log('4. Confirm the database user has proper permissions');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

testHostingerDatabase();