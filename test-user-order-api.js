// Test to verify user order API endpoint
const http = require('http');

async function testUserOrderApi() {
  console.log('Testing user order API endpoint...');
  
  // Test with a sample order number
  const orderNumber = 'ORD-1761569526200-194';
  const userId = 'user-1761557040324';
  
  console.log(`Testing order ${orderNumber} for user ${userId}`);
  
  // Test the user order API endpoint (this would normally require authentication)
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/user/orders/${orderNumber}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      // Note: In a real test, we would need to include an auth token
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      
      try {
        const jsonData = JSON.parse(data);
        console.log('Response:', JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success) {
          console.log(`✅ User order API returned success with order: ${jsonData.order.order_number}`);
        } else {
          console.log('❌ User order API returned error:', jsonData.error);
        }
      } catch (parseError) {
        console.log('❌ Failed to parse JSON response:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });
  
  req.end();
}

testUserOrderApi();