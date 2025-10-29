// Test to verify order tracking functionality
const mysql = require('mysql2/promise');

async function testOrderTracking() {
  console.log('Testing order tracking functionality...');
  
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
    
    // Get a sample order to test with
    const [orderRows] = await connection.execute(
      'SELECT id, order_number, status FROM orders LIMIT 1'
    );
    
    if (orderRows.length === 0) {
      console.log('⚠️  No orders found in database');
      await connection.end();
      return;
    }
    
    const order = orderRows[0];
    console.log(`Testing with order:`);
    console.log(`  Internal ID: ${order.id}`);
    console.log(`  Order Number: ${order.order_number}`);
    console.log(`  Status: ${order.status}`);
    
    // Test searching by order_number (what users will enter)
    const [searchByOrderNumber] = await connection.execute(
      'SELECT id, order_number, status FROM orders WHERE order_number = ?',
      [order.order_number]
    );
    
    if (searchByOrderNumber.length > 0) {
      console.log(`✅ Order found by order_number: ${searchByOrderNumber[0].order_number}`);
    } else {
      console.log('❌ Order not found by order_number');
    }
    
    // Test searching by internal id (what was previously used)
    const [searchByInternalId] = await connection.execute(
      'SELECT id, order_number, status FROM orders WHERE id = ?',
      [order.id]
    );
    
    if (searchByInternalId.length > 0) {
      console.log(`✅ Order found by internal ID: ${searchByInternalId[0].id}`);
    } else {
      console.log('❌ Order not found by internal ID');
    }
    
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

testOrderTracking();