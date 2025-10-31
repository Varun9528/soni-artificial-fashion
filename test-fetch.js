// Test fetch call to API endpoint
async function testFetch() {
  try {
    console.log('Testing fetch call to API endpoint...');
    
    // Simulate browser fetch call
    const response = await fetch('http://localhost:3001/api/products');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', {
      success: data.success,
      products: data.products ? data.products.length : 0,
      pagination: data.pagination
    });
    
    // Show first product if available
    if (data.products && data.products.length > 0) {
      console.log('First product:', {
        id: data.products[0].id,
        title: data.products[0].title,
        price: data.products[0].price
      });
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testFetch();