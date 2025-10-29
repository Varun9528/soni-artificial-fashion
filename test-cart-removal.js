// Test script to verify cart removal functionality
const testCartRemoval = async () => {
  try {
    console.log('Testing cart removal functionality...');
    
    // First, let's try to add an item to cart
    const addToCartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: 'test-product-1',
        quantity: 2
      })
    });
    
    const addToCartData = await addToCartResponse.json();
    console.log('Add to cart response:', addToCartData);
    
    // Then, let's try to remove the item from cart
    const removeFromCartResponse = await fetch(`http://localhost:3000/api/cart?productId=test-product-1`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const removeFromCartData = await removeFromCartResponse.json();
    console.log('Remove from cart response:', removeFromCartData);
    
    if (removeFromCartData.success) {
      console.log('✅ Cart removal test passed!');
    } else {
      console.log('❌ Cart removal test failed:', removeFromCartData.error);
    }
  } catch (error) {
    console.error('❌ Cart removal test failed with error:', error);
  }
};

testCartRemoval();