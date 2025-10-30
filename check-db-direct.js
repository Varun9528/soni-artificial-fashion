const mysql = require('mysql2');

console.log('Attempting direct database connection...');

// Using mysql2 with callbacks to see detailed error information
const connection = mysql.createConnection({
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_son',
  password: 'Soni@2k25$$',
  database: 'u632940212_son',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed!');
    console.log('Error code:', err.code);
    console.log('Error message:', err.message);
    console.log('Error number:', err.errno);
    console.log('SQL message:', err.sqlMessage);
    return;
  }
  
  console.log('✅ Database connection successful!');
  
  connection.query('SELECT COUNT(*) as count FROM products', (error, results) => {
    if (error) {
      console.log('❌ Query failed!');
      console.log('Error:', error.message);
      connection.end();
      return;
    }
    
    console.log(`✅ Found ${results[0].count} products in the database`);
    connection.end();
    
    console.log('\n🎉 Database connection and query successful!');
    console.log('Your products should now be visible on your website.');
  });
});