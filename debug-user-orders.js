// Debug script to check user orders data
const mysql = require('mysql2/promise');

async function debugUserOrders() {
  console.log('Debugging user orders data...');
  
  let connection;
  
  try {
    // Create connection to database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'soni_artificial_fashion'
    });
    
    console.log('✅ Connected to database');
    
    // Get a sample user
    const [userRows] = await connection.execute(
      'SELECT id, email FROM users LIMIT 1'
    );
    
    if (userRows.length === 0) {
      console.log('⚠️  No users found in database');
      await connection.end();
      return;
    }
    
    const user = userRows[0];
    console.log(`Testing with user: ${user.email} (ID: ${user.id})`);
    
    // Get orders for this user
    const [orderRows] = await connection.execute(
      'SELECT id, order_number, status FROM orders WHERE user_id = ? LIMIT 3',
      [user.id]
    );
    
    console.log(`Found ${orderRows.length} orders for this user:`);
    orderRows.forEach((order, index) => {
      console.log(`  ${index + 1}. ID: ${order.id}, Order Number: ${order.order_number}, Status: ${order.status}`);
    });
    
    // Close connection
    await connection.end();
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    
    // Try to close connection if it exists
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('❌ Error closing database connection:', closeError.message);
      }
    }
  }
}

debugUserOrders();