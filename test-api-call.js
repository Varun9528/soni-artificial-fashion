const http = require('http');

// Make a request to the local API endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/products',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Headers:', res.headers);
    console.log('Response Body:', data);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON:', {
        success: jsonData.success,
        productCount: jsonData.products ? jsonData.products.length : 0,
        pagination: jsonData.pagination
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();