const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test with the provided credentials
    const connection = await mysql.createConnection({
      host: 'auth-db1555.hstgr.io',
      user: 'u632940212_u632940212_fas',
      password: 'Soni@2k25$$',
      database: 'u632940212_u632940212_son',
      port: 3306,
      connectTimeout: 10000 // 10 seconds timeout
    });
    
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log('✅ Products count:', rows[0].count);
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

testConnection();