// Test script to verify the checkout flow with fixes
const testCheckoutFlowFixed = async () => {
  try {
    console.log('Testing checkout flow with fixes...');
    
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
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      console.log('❌ Login failed:', loginData.error);
      return;
    }
    
    const token = loginData.token;
    console.log('✅ Login successful, got token');
    
    // Get cart items
    console.log('Getting cart items...');
    const cartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const cartData = await cartResponse.json();
    console.log('Cart response status:', cartResponse.status);
    console.log('Cart items:', cartData);
    
    if (!cartData.success) {
      console.log('❌ Failed to get cart items:', cartData.error);
      return;
    }
    
    console.log('✅ Cart items retrieved successfully');
    console.log('Number of items in cart:', cartData.items.length);
    
    if (cartData.items.length === 0) {
      console.log('⚠️  Cart is empty, adding a test item...');
      
      // Add an item to cart
      const addToCartResponse = await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: 'prod-001',
          quantity: 1
        })
      });
      
      const addToCartData = await addToCartResponse.json();
      console.log('Add to cart response status:', addToCartResponse.status);
      console.log('Add to cart response:', addToCartData);
      
      if (!addToCartData.success) {
        console.log('❌ Failed to add item to cart:', addToCartData.error);
        return;
      }
      
      console.log('✅ Item added to cart successfully');
    }
    
    // Get updated cart items
    console.log('Getting updated cart items...');
    const updatedCartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const updatedCartData = await updatedCartResponse.json();
    console.log('Updated cart items:', updatedCartData);
    
    // Try to access checkout API with valid data
    console.log('Testing checkout API access with valid data...');
    const checkoutTestResponse = await fetch('http://localhost:3000/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: updatedCartData.items,
        shippingAddress: {
          fullName: 'Test User',
          phone: '9876543210', // Valid Indian phone number
          addressLine1: 'Test Address', // Correct field name
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        },
        paymentMethod: 'cod',
        subtotal: 100,
        shipping: 0,
        tax: 18,
        total: 118
      })
    });
    
    const checkoutTestData = await checkoutTestResponse.json();
    console.log('Checkout API response status:', checkoutTestResponse.status);
    console.log('Checkout API response:', checkoutTestData);
    
    if (checkoutTestData.success) {
      console.log('✅ Checkout API working correctly');
      console.log('Order created with ID:', checkoutTestData.order.id);
    } else {
      console.log('❌ Checkout API failed:', checkoutTestData.error);
      if (checkoutTestData.errors) {
        console.log('Validation errors:', checkoutTestData.errors);
      }
    }
    
  } catch (error) {
    console.error('❌ Checkout flow test failed with error:', error);
  }
};

testCheckoutFlowFixed();