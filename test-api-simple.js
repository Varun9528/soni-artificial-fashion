const https = require('https');
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
    console.log('Headers:', res.headers);
    console.log('Data:', data);
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();