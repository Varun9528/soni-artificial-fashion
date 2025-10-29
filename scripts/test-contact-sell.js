const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function testContactSell() {
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Check contact requests
    const [contactRequests] = await pool.execute('SELECT * FROM contact_requests');
    
    console.log('Contact requests in database:');
    console.log('===========================');
    contactRequests.forEach(request => {
      console.log(`ID: ${request.id}`);
      console.log(`Name: ${request.name}`);
      console.log(`Email: ${request.email}`);
      console.log(`Subject: ${request.subject}`);
      console.log(`-------------------`);
    });
    
    // Check sell requests
    const [sellRequests] = await pool.execute('SELECT * FROM sell_requests');
    
    console.log('\nSell requests in database:');
    console.log('========================');
    sellRequests.forEach(request => {
      console.log(`ID: ${request.id}`);
      console.log(`Name: ${request.name}`);
      console.log(`Business: ${request.business_name}`);
      console.log(`-------------------`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

testContactSell();