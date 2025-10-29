// Test script to verify all notification systems
const testNotifications = async () => {
  try {
    console.log('Testing notification systems...');
    
    // First, let's login to get a token
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'varuntirole@gmail.com',
        password: 'Varun@123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    
    if (!loginData.success) {
      console.log('❌ Login failed:', loginData.error);
      return;
    }
    
    const token = loginData.token;
    console.log('✅ Login successful, got token');
    
    // Test 1: Order creation notification
    console.log('\n--- Testing Order Creation Notification ---');
    
    // Create a test order
    const orderData = {
      items: [
        {
          product: {
            id: 'prod-001',
            title: { en: 'Gold Necklace Set' },
            price: 2499
          },
          quantity: 1
        }
      ],
      payment_method: 'cod',
      shipping_address: {
        fullName: 'Varun Tirole',
        phone: '9399115504',
        addressLine1: 'Test Address Line 1',
        addressLine2: 'Test Address Line 2',
        city: 'Pachmarhi',
        state: 'Madhya Pradesh',
        pincode: '461881'
      },
      billing_address: {
        fullName: 'Varun Tirole',
        phone: '9399115504',
        addressLine1: 'Test Address Line 1',
        addressLine2: 'Test Address Line 2',
        city: 'Pachmarhi',
        state: 'Madhya Pradesh',
        pincode: '461881'
      },
      subtotal: 2499,
      shipping_cost: 0,
      total_amount: 2499
    };
    
    const orderResponse = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    const orderDataResponse = await orderResponse.json();
    console.log('Order creation response status:', orderResponse.status);
    console.log('Order creation response:', orderDataResponse);
    
    if (!orderDataResponse.success) {
      console.log('❌ Failed to create order:', orderDataResponse.error);
      return;
    }
    
    const orderId = orderDataResponse.order.id;
    console.log('✅ Order created successfully with ID:', orderId);
    
    // Test 2: Order status update notifications (admin)
    console.log('\n--- Testing Order Status Update Notifications ---');
    
    // Login as admin (if we have admin credentials)
    // For now, we'll test the admin endpoint directly
    
    // Test shipped notification
    console.log('Testing shipped notification...');
    const shippedResponse = await fetch(`http://localhost:3000/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'SHIPPED'
      })
    });
    
    const shippedData = await shippedResponse.json();
    console.log('Shipped update response status:', shippedResponse.status);
    console.log('Shipped update response:', shippedData);
    
    if (!shippedData.success) {
      console.log('❌ Failed to update order to shipped:', shippedData.error);
      // This might fail if user doesn't have admin permissions, which is expected
    } else {
      console.log('✅ Order status updated to SHIPPED');
    }
    
    // Test out for delivery notification
    console.log('Testing out for delivery notification...');
    const outForDeliveryResponse = await fetch(`http://localhost:3000/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'OUT_FOR_DELIVERY'
      })
    });
    
    const outForDeliveryData = await outForDeliveryResponse.json();
    console.log('Out for delivery update response status:', outForDeliveryResponse.status);
    console.log('Out for delivery update response:', outForDeliveryData);
    
    if (!outForDeliveryData.success) {
      console.log('❌ Failed to update order to out for delivery:', outForDeliveryData.error);
      // This might fail if user doesn't have admin permissions, which is expected
    } else {
      console.log('✅ Order status updated to OUT_FOR_DELIVERY');
    }
    
    // Test delivered notification
    console.log('Testing delivered notification...');
    const deliveredResponse = await fetch(`http://localhost:3000/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: 'DELIVERED'
      })
    });
    
    const deliveredData = await deliveredResponse.json();
    console.log('Delivered update response status:', deliveredResponse.status);
    console.log('Delivered update response:', deliveredData);
    
    if (!deliveredData.success) {
      console.log('❌ Failed to update order to delivered:', deliveredData.error);
      // This might fail if user doesn't have admin permissions, which is expected
    } else {
      console.log('✅ Order status updated to DELIVERED');
    }
    
    console.log('\n✅ All notification tests completed!');
    console.log('Check the server console for email and push notification logs.');
    
  } catch (error) {
    console.error('❌ Notification test failed with error:', error);
  }
};

testNotifications();