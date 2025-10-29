// Test to simulate order finding logic
const mysql = require('mysql2/promise');

async function testOrderFinding() {
  console.log('Testing order finding logic...');
  
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
    
    // Test with a known order number
    const orderNumber = 'ORD-1761569526200-194';
    const userId = 'user-1761557040324';
    
    console.log(`Testing with order number: ${orderNumber}`);
    console.log(`For user ID: ${userId}`);
    
    // Simulate the getOrdersByUserId function
    const [userOrders] = await connection.execute(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);
    
    console.log(`Found ${userOrders.length} orders for user ${userId}`);
    
    // Simulate the finding logic from the API
    const foundOrder = userOrders.find((o) => o.order_number === orderNumber);
    
    if (foundOrder) {
      console.log(`✅ Found order: ${foundOrder.order_number}`);
      console.log(`   Internal ID: ${foundOrder.id}`);
      console.log(`   Status: ${foundOrder.status}`);
    } else {
      console.log('❌ Order not found in user orders');
      
      // Let's check if the order exists at all
      const [allOrders] = await connection.execute(
        'SELECT id, order_number, user_id, status FROM orders WHERE order_number = ?',
        [orderNumber]
      );
      
      if (allOrders.length > 0) {
        console.log(`   Order exists but for user ${allOrders[0].user_id} (not ${userId})`);
      } else {
        console.log('   Order does not exist in database');
      }
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

testOrderFinding();