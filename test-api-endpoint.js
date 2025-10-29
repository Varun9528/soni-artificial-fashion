// Test to verify API endpoint is working
const http = require('http');

async function testApiEndpoint() {
  console.log('Testing API endpoint...');
  
  // Test with the order number from our previous test
  const orderNumber = 'ORD-1761569526200-194';
  
  // Test the order API endpoint
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/orders/${orderNumber}`,
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
      
      try {
        const jsonData = JSON.parse(data);
        console.log('Response:', JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success && jsonData.order) {
          console.log(`✅ API returned success with order: ${jsonData.order.order_number}`);
          console.log(`   Status: ${jsonData.order.status}`);
        } else {
          console.log('❌ API did not return expected order data');
          console.log('   Error:', jsonData.error);
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

testApiEndpoint();