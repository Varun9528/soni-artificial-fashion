// Simple database test to see current products
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
  
  // Query to see current products
  connection.query('SELECT id, slug, title_en, price FROM products', (error, results) => {
    if (error) {
      console.error('Error querying products:', error);
    } else {
      console.log('Current products in database:');
      console.log('----------------------------------------');
      results.forEach(product => {
        console.log(`ID: ${product.id}`);
        console.log(`Slug: ${product.slug}`);
        console.log(`Title: ${product.title_en}`);
        console.log(`Price: ₹${product.price}`);
        console.log('----------------------------------------');
      });
      console.log(`Total products: ${results.length}`);
    }
    
    connection.end();
  });
});