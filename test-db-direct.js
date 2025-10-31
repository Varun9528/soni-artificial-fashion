// Test the database connection and product fetching directly
const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'auth-db1555.hstgr.io',
  user: process.env.DB_USER || 'u632940212_u632940212_fas',
  password: process.env.DB_PASSWORD || 'Soni@2k25$$',
  database: process.env.DB_NAME || 'u632940212_u632940212_son',
  port: parseInt(process.env.DB_PORT || '3306'),
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  keepAliveInitialDelay: 0,
  enableKeepAlive: true
};

async function testDbDirect() {
  let connection;
  
  try {
    console.log('Testing database connection...');
    
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database successfully!');
    
    // Test query - get products with proper joins
    let query = `
      SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
      c.id as category_id, a.name as artisan_name, a.id as artisan_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN artisans a ON p.artisan_id = a.id
      WHERE p.is_active = 1
    `;
    
    const params = [];
    const page = 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    
    // Add ordering and pagination
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    console.log('Executing query:', query);
    console.log('With params:', params);
    
    const [rows] = await connection.execute(query, params);
    console.log('Found products:', rows.length);
    
    // Show first product if available
    if (rows.length > 0) {
      console.log('First product:', {
        id: rows[0].id,
        title_en: rows[0].title_en,
        title_hi: rows[0].title_hi,
        price: rows[0].price,
        category_id: rows[0].category_id,
        category_name_en: rows[0].category_name_en,
        category_name_hi: rows[0].category_name_hi
      });
    }
    
    await connection.end();
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (connection) {
      await connection.end();
    }
  }
}

testDbDirect();