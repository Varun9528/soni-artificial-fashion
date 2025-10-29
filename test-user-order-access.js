// Test to simulate user order access with different users
const mysql = require('mysql2/promise');

async function testUserOrderAccess() {
  console.log('Testing user order access...');
  
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
    
    // Get the specific order we're testing with
    const orderNumber = 'ORD-1761569526200-194';
    console.log(`Testing access to order: ${orderNumber}`);
    
    // Get the order details
    const [orderRows] = await connection.execute(
      'SELECT id, order_number, user_id FROM orders WHERE order_number = ?',
      [orderNumber]
    );
    
    if (orderRows.length === 0) {
      console.log('❌ Order not found in database');
      await connection.end();
      return;
    }
    
    const order = orderRows[0];
    console.log(`Order found: ID=${order.id}, User ID=${order.user_id}`);
    
    // Get the user who owns this order
    const [userRows] = await connection.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [order.user_id]
    );
    
    if (userRows.length === 0) {
      console.log('❌ User not found in database');
      await connection.end();
      return;
    }
    
    const user = userRows[0];
    console.log(`Order owner: ${user.name} (${user.email})`);
    
    // Simulate the API logic - get all orders for this user
    const [userOrders] = await connection.execute(`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [user.id]);
    
    console.log(`User has ${userOrders.length} orders`);
    
    // Try to find the specific order
    const foundOrder = userOrders.find((o) => o.order_number === orderNumber);
    
    if (foundOrder) {
      console.log(`✅ Order found in user's order list`);
    } else {
      console.log('❌ Order NOT found in user\'s order list');
      console.log('This would cause "Order not found" error');
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

testUserOrderAccess();