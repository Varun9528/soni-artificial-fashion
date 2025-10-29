// Enable real database for testing
// @ts-ignore
process.env.NODE_ENV = 'development';

// Import the database connection
import { db, enableRealDatabase } from './src/lib/database/connection';

// Enable real database
enableRealDatabase();

async function testDeliveryAgentInfo() {
  try {
    console.log('Testing delivery agent information...');
    
    // Test getOrdersByUserId function
    const orders = await db.getOrdersByUserId('user-1761557040324');
    const targetOrder = orders.find(o => o.order_number === 'ORD-1761628983770-400');
    
    console.log('Target order delivery agent info:');
    console.log('Delivery Agent Name:', targetOrder?.deliveryAgentName);
    console.log('Delivery Agent Phone:', targetOrder?.deliveryAgentPhone);
    
    // Test getOrderById function
    const orderById = await db.getOrderById(targetOrder?.id);
    console.log('\nOrder by ID delivery agent info:');
    console.log('Delivery Agent Name:', orderById?.deliveryAgentName);
    console.log('Delivery Agent Phone:', orderById?.deliveryAgentPhone);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing delivery agent info:', error);
  }
}

testDeliveryAgentInfo();