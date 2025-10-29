// Debug script to check profile orders transformation
const fs = require('fs');
const path = require('path');

// Simulate the transformation logic from the profile orders page
function debugOrderTransformation() {
  console.log('Debugging order transformation logic...');
  
  // Sample order data from database (similar to what getOrdersByUserId returns)
  const sampleOrders = [
    {
      id: 'order-1761569526202-97z63ou0h',
      order_number: 'ORD-1761569526200-194',
      status: 'shipped',
      total_amount: 118,
      created_at: '2025-10-27T18:22:06.000Z',
      items: [
        {
          product_name: 'Test Product',
          quantity: 1,
          price: 100
        }
      ]
    }
  ];
  
  console.log('Sample orders from database:');
  console.log(JSON.stringify(sampleOrders, null, 2));
  
  // Transform the data to match the expected structure (same logic as in profile orders page)
  const transformedOrders = sampleOrders.map((order) => ({
    id: order.id || Math.random().toString(36).substr(2, 9),
    orderNumber: order.order_number || `ORD-${order.id}`,
    status: order.status?.toLowerCase() || 'processing',
    totalAmount: order.total_amount || 0,
    createdAt: order.created_at || new Date().toISOString(),
    items: order.items?.map((item) => ({
      product: {
        title: {
          en: item.product_name || 'Unknown Product',
          hi: item.product_name || 'अज्ञात उत्पाद'
        }
      },
      quantity: item.quantity || 1,
      price: item.price || 0
    })) || []
  }));
  
  console.log('\nTransformed orders:');
  console.log(JSON.stringify(transformedOrders, null, 2));
  
  // Check the URL that would be generated for "View Details"
  const firstOrder = transformedOrders[0];
  console.log(`\nURL for View Details: /profile/orders/${firstOrder.orderNumber}`);
  
  // Verify this matches what we expect
  if (firstOrder.orderNumber === 'ORD-1761569526200-194') {
    console.log('✅ Order number transformation is correct');
  } else {
    console.log('❌ Order number transformation is incorrect');
  }
}

debugOrderTransformation();