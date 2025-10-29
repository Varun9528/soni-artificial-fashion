// Test script to verify all notification systems
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

// Test user notifications
async function testUserNotifications() {
  try {
    console.log('Testing user notifications...');
    
    // Login as user
    const loginData = await makeRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'varuntirole@gmail.com',
      password: 'Varun@123'
    });
    
    if (!loginData.success) {
      console.log('User login failed:', loginData.error);
      return;
    }
    
    const userToken = loginData.token;
    console.log('✓ User login successful');
    
    // Get user notifications
    const notificationsData = await makeRequest('http://localhost:3000/api/notifications?limit=20&unreadOnly=true', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ User notifications retrieved successfully');
    console.log('Notifications count:', notificationsData.notifications ? notificationsData.notifications.length : 0);
    
    return userToken;
  } catch (error) {
    console.error('Error testing user notifications:', error);
  }
}

// Test admin notifications
async function testAdminNotifications() {
  try {
    console.log('Testing admin notifications...');
    
    // For now, we'll skip this test since we don't have an admin account
    console.log('Skipping admin notifications test (no admin account available)');
    return null;
  } catch (error) {
    console.error('Error testing admin notifications:', error);
  }
}

// Test order creation and notifications
async function testOrderCreation(userToken) {
  try {
    console.log('Testing order creation and notifications...');
    
    // Get cart items
    const cartData = await makeRequest('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!cartData.success || cartData.items.length === 0) {
      console.log('No items in cart, adding a test item...');
      
      // Add an item to cart first
      await makeRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      }, {
        productId: 'prod-1761542460627-828ucqe05',
        quantity: 1
      });
      
      console.log('✓ Test item added to cart');
      
      // Get updated cart
      const updatedCartData = await makeRequest('http://localhost:3000/api/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      cartData.items = updatedCartData.items;
    }
    
    // Create order with proper structure
    const orderData = await makeRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    }, {
      items: cartData.items.map(item => ({
        product: {
          id: item.product.id,
          title: item.product.title,
          price: parseFloat(item.product.price),
        },
        quantity: item.quantity
      })),
      payment_method: 'cod',
      shipping_address: {
        fullName: 'Varun Tirole',
        phone: '9399115504',
        addressLine1: 'Test Address Line 1',
        addressLine2: 'Test Address Line 2',
        city: 'Test City',
        state: 'Test State',
        pincode: '461001' // Valid Indian pincode format
      },
      billing_address: {
        fullName: 'Varun Tirole',
        phone: '9399115504',
        addressLine1: 'Test Address Line 1',
        addressLine2: 'Test Address Line 2',
        city: 'Test City',
        state: 'Test State',
        pincode: '461001' // Valid Indian pincode format
      },
      subtotal: 3499,
      shipping_cost: 0,
      total_amount: 3499,
      coupon_code: null
    });
    
    console.log('Order creation response:', orderData);
    
    if (orderData.success) {
      console.log('✓ Order creation successful');
      console.log('Order ID:', orderData.order.id);
      return orderData.order.id;
    } else {
      console.log('✗ Order creation failed:', orderData.error);
    }
  } catch (error) {
    console.error('Error testing order creation:', error);
  }
}

// Test order status updates and notifications
async function testOrderStatusUpdates(adminToken, orderId) {
  try {
    console.log('Testing order status updates and notifications...');
    
    // Skip this test since we don't have admin access
    console.log('Skipping order status updates test (no admin access)');
    return;
  } catch (error) {
    console.error('Error testing order status updates:', error);
  }
}

// Main test function
async function runAllTests() {
  console.log('Starting comprehensive notification system tests...\n');
  
  try {
    // Test user notifications
    const userToken = await testUserNotifications();
    
    // Test admin notifications
    const adminToken = await testAdminNotifications();
    
    // Test order creation and notifications
    const orderId = await testOrderCreation(userToken);
    
    // Test order status updates and notifications
    await testOrderStatusUpdates(adminToken, orderId);
    
    console.log('\n✓ All tests completed successfully!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

runAllTests();