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
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
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

// Test simple authenticated request
async function testSimpleAuth() {
  try {
    console.log('Testing simple authentication...');
    
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
    
    // Test authenticated request to a simple endpoint
    const testData = await makeRequest('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Test data:', testData);
    
    console.log('✓ Simple authentication test completed successfully!');
  } catch (error) {
    console.error('Error testing simple authentication:', error);
  }
}

testSimpleAuth();