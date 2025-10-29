// Simple test script to verify authentication
const https = require('https');
const http = require('http');

// Helper function to make HTTP requests
function makeRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };
    
    console.log(`Making ${options.method || 'GET'} request to ${url}`);
    console.log('Request options:', requestOptions);
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      console.log(`Response status: ${res.statusCode}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response body:', data);
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Test authentication
async function testAuth() {
  try {
    console.log('Testing authentication...');
    
    // Login
    const loginData = await makeRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'varuntirole@gmail.com',
      password: 'Varun@123'
    });
    
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      console.log('Login failed:', loginData.error);
      return;
    }
    
    const token = loginData.token;
    console.log('Got authentication token:', token.substring(0, 20) + '...');
    
    // Test authenticated request to cart API
    const cartData = await makeRequest('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Cart data:', cartData);
    
    // Test authenticated request to orders API
    const ordersData = await makeRequest('http://localhost:3000/api/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Orders data:', ordersData);
    
    console.log('✓ Authentication test completed successfully!');
  } catch (error) {
    console.error('Error testing authentication:', error);
  }
}

testAuth();