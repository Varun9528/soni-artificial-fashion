// Test to verify order API response
const http = require('http');

async function testOrderApi() {
  console.log('Testing order API response...');
  
  // Test the order API endpoint
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/orders/order-1761569526202-97z63ou0h',
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
      console.log('Response Headers:', res.headers);
      
      try {
        const jsonData = JSON.parse(data);
        console.log('Response Data:', JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success && jsonData.order) {
          console.log(`✅ Order API returned success with status: ${jsonData.order.status}`);
        } else {
          console.log('❌ Order API did not return expected data');
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

testOrderApi();