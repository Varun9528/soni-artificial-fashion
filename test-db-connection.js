const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    // Create connection without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ MySQL connection successful!');
    
    // Check if database exists
    const [rows] = await connection.execute('SHOW DATABASES LIKE ?', ['pachmarhi']);
    
    if (rows.length > 0) {
      console.log('✅ Database "pachmarhi" exists');
    } else {
      console.log('❌ Database "pachmarhi" does not exist');
      console.log('Creating database...');
      await connection.execute('CREATE DATABASE IF NOT EXISTS pachmarhi');
      console.log('✅ Database "pachmarhi" created successfully!');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.log('Please make sure MySQL is running and credentials are correct.');
  }
}

testConnection();