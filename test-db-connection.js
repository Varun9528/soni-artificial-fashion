const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DB Config:', dbConfig);
    
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Database connection successful!');
    
    // Run a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query result:', rows);
    
    // Close the connection
    await connection.end();
    
    console.log('Database connection test completed successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();