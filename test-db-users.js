// Test to check users in the real database
const mysql = require('mysql2/promise');

async function testDatabaseUsers() {
  try {
    // Create connection to database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'soni_artificial_fashion'
    });
    
    console.log('Connected to database');
    
    // Query users
    const [rows] = await connection.execute('SELECT id, email, name, role FROM users');
    
    console.log('Users in database:');
    rows.forEach(user => {
      console.log(`- ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Role: ${user.role}`);
    });
    
    // Close connection
    await connection.end();
    
  } catch (error) {
    console.error('Database error:', error);
  }
}

testDatabaseUsers();