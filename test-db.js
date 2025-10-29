const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306'),
  // Connection pool configuration to prevent "too many connections" error
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  keepAliveInitialDelay: 0,
  enableKeepAlive: true
};

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DB Config:', dbConfig);
    
    // Create a connection pool with better configuration
    const pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    
    // Run a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query result:', rows);
    
    // Release the connection
    connection.release();
    
    // Close the pool
    await pool.end();
    console.log('Database connection test completed successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();