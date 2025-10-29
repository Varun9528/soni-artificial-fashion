// Test to verify order status update functionality
const mysql = require('mysql2/promise');

async function testOrderStatusUpdate() {
  console.log('Testing order status update functionality...');
  
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
    
    // Check if there are any orders in the database
    const [orderRows] = await connection.execute('SELECT id, status FROM orders LIMIT 1');
    
    if (orderRows.length === 0) {
      console.log('⚠️  No orders found in database');
      await connection.end();
      return;
    }
    
    const orderId = orderRows[0].id;
    const currentStatus = orderRows[0].status;
    
    console.log(`Found order ${orderId} with current status: ${currentStatus}`);
    
    // Try to update the order status
    const newStatus = 'SHIPPED';
    const [updateResult] = await connection.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [newStatus, orderId]
    );
    
    if (updateResult.affectedRows > 0) {
      console.log(`✅ Order status updated to ${newStatus}`);
      
      // Verify the update
      const [verifyRows] = await connection.execute(
        'SELECT status FROM orders WHERE id = ?',
        [orderId]
      );
      
      if (verifyRows.length > 0 && verifyRows[0].status === newStatus) {
        console.log('✅ Order status update verified in database');
      } else {
        console.log('❌ Order status update verification failed');
      }
    } else {
      console.log('❌ Failed to update order status');
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

testOrderStatusUpdate();