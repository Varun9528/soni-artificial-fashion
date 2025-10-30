// Load environment variables
require('dotenv').config({ path: '.env.production' });

const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306'),
};

console.log('Checking database structure...');

async function checkDatabaseStructure() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Get all tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Database tables:');
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${Object.values(table)[0]}`);
    });
    
    // Check specific table structures
    const tableNames = [
      'users', 'categories', 'artisans', 'products', 'product_images', 
      'banners', 'carts', 'wishlists', 'orders', 'order_items'
    ];
    
    console.log('\nChecking table structures:');
    
    for (const tableName of tableNames) {
      try {
        const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
        console.log(`\n${tableName} table structure:`);
        columns.forEach(column => {
          console.log(`  ${column.Field} - ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Key} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
        });
      } catch (error) {
        console.log(`${tableName} table not found or error: ${error.message}`);
      }
    }
    
    // Check data counts
    console.log('\nChecking data counts:');
    const dataTables = ['users', 'categories', 'artisans', 'products', 'banners'];
    
    for (const tableName of dataTables) {
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`${tableName}: ${count[0].count} records`);
      } catch (error) {
        console.log(`${tableName} count error: ${error.message}`);
      }
    }
    
    await connection.end();
    
    console.log('\nDatabase structure check completed!');
  } catch (error) {
    console.error('Database structure check failed:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

checkDatabaseStructure();