// Test to verify API endpoint with detailed debugging
const http = require('http');

async function testApiEndpointDetailed() {
  console.log('Testing API endpoint with detailed debugging...');
  
  // Test with a sample order number
  const orderNumber = 'ORD-1761569526200-194';
  
  console.log(`Testing order details API for order: ${orderNumber}`);
  
  // Test the user order details API endpoint
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/user/orders/${orderNumber}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log('Headers:', res.headers);
      
      try {
        const jsonData = JSON.parse(data);
        console.log('Response:', JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success) {
          console.log(`✅ API returned success with order: ${jsonData.order.order_number}`);
        } else {
          console.log('❌ API returned error:', jsonData.error);
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

testApiEndpointDetailed();