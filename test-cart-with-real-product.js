// Test script to verify the cart flow with a real product
const testCartWithRealProduct = async () => {
  try {
    console.log('Testing cart flow with real product...');
    
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
    
    // Add a real product to cart
    console.log('Adding real product to cart...');
    const addToCartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: 'prod-001',
        quantity: 2
      })
    });
    
    const addToCartData = await addToCartResponse.json();
    console.log('Add to cart response status:', addToCartResponse.status);
    console.log('Add to cart response:', addToCartData);
    
    if (!addToCartData.success) {
      console.log('❌ Failed to add item to cart:', addToCartData.error);
      return;
    }
    
    console.log('✅ Product added to cart successfully');
    
    // Get cart items to verify the item was added
    console.log('Getting cart items...');
    const getCartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const getCartData = await getCartResponse.json();
    console.log('Get cart response status:', getCartResponse.status);
    console.log('Cart items:', getCartData);
    
    if (!getCartData.success) {
      console.log('❌ Failed to get cart items:', getCartData.error);
      return;
    }
    
    console.log('✅ Cart items retrieved successfully');
    
    // Remove the item from cart
    console.log('Removing item from cart...');
    const removeFromCartResponse = await fetch(`http://localhost:3000/api/cart?productId=prod-001`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const removeFromCartData = await removeFromCartResponse.json();
    console.log('Remove from cart response status:', removeFromCartResponse.status);
    console.log('Remove from cart response:', removeFromCartData);
    
    if (!removeFromCartData.success) {
      console.log('❌ Failed to remove item from cart:', removeFromCartData.error);
      return;
    }
    
    console.log('✅ Item removed from cart successfully');
    
    // Get cart items again to verify the item was removed
    console.log('Getting cart items after removal...');
    const getCartAfterRemovalResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const getCartAfterRemovalData = await getCartAfterRemovalResponse.json();
    console.log('Get cart after removal response status:', getCartAfterRemovalResponse.status);
    console.log('Cart items after removal:', getCartAfterRemovalData);
    
    if (!getCartAfterRemovalData.success) {
      console.log('❌ Failed to get cart items after removal:', getCartAfterRemovalData.error);
      return;
    }
    
    // Check if the item was actually removed
    const itemExists = getCartAfterRemovalData.items.some(item => item.productId === 'prod-001');
    if (itemExists) {
      console.log('❌ Item still exists in cart after removal');
      return;
    }
    
    console.log('✅ Cart removal test passed! Item successfully removed from cart');
    
  } catch (error) {
    console.error('❌ Cart flow test failed with error:', error);
  }
};

testCartWithRealProduct();