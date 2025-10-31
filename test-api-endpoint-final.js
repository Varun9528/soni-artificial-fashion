const http = require('http');

// Make a request to the local API endpoint
const options = {
  hostname: 'localhost',
  port: 3001,
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
    
    try {
      const jsonData = JSON.parse(data);
      console.log('Success:', jsonData.success);
      console.log('Product Count:', jsonData.products ? jsonData.products.length : 0);
      console.log('Pagination:', jsonData.pagination);
      
      // Show first product if available
      if (jsonData.products && jsonData.products.length > 0) {
        console.log('First Product:', {
          id: jsonData.products[0].id,
          title: jsonData.products[0].title,
          price: jsonData.products[0].price
        });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw data:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();