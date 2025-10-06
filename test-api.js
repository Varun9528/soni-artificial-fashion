const http = require('http');

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
    try {
      const jsonData = JSON.parse(data);
      console.log('API Response:');
      console.log('Success:', jsonData.success);
      console.log('Products count:', jsonData.products ? jsonData.products.length : 0);
      if (jsonData.products && jsonData.products.length > 0) {
        console.log('First product:', jsonData.products[0].title);
      }
    } catch (error) {
      console.log('Error parsing JSON:', error.message);
      console.log('Raw data:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.end();