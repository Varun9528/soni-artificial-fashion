// Test script to verify the authentication context works properly
const testAuthContext = async () => {
  try {
    console.log('Testing authentication context...');
    
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
    const user = loginData.user;
    console.log('✅ Login successful');
    console.log('User:', user);
    
    // Test accessing a protected route
    console.log('Testing access to protected cart API...');
    const cartResponse = await fetch('http://localhost:3000/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Cart API response status:', cartResponse.status);
    
    if (cartResponse.status === 200) {
      console.log('✅ Authentication context working correctly');
      console.log('✅ User can access protected routes');
    } else {
      console.log('❌ Authentication failed');
      const errorData = await cartResponse.json();
      console.log('Error:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Authentication context test failed with error:', error);
  }
};

testAuthContext();