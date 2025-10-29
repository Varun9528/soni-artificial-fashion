// Test to verify user orders API functionality
const http = require('http');

async function testUserOrdersApi() {
  console.log('Testing user orders API...');
  
  // Test the user orders API endpoint (this would normally require authentication)
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/orders',
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
          console.log(`✅ User orders API returned success with ${jsonData.orders?.length || 0} orders`);
        } else {
          console.log('❌ User orders API returned error:', jsonData.error);
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

testUserOrdersApi();