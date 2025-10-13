// Simple database test without Prisma
const mysql = require('mysql2');

// Database configuration from .env
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pachmarhi_marketplace_final',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  
  console.log('Database connected successfully!');
  
  // Test query to check if we can access products table
  connection.query('SELECT COUNT(*) as count FROM products', (error, results) => {
    if (error) {
      console.log('Products table may not exist yet or is empty');
    } else {
      console.log(`Current product count: ${results[0].count}`);
    }
    
    connection.end();
  });
});