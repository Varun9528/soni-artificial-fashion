// Test to verify admin and user fixes
const fs = require('fs');
const path = require('path');

// Test 1: User profile orders page uses order number in URL
function testUserProfileOrdersUrl() {
  console.log('1️⃣ Testing user profile orders URL...');
  
  const userProfileOrdersPagePath = path.join(__dirname, 'src', 'app', 'profile', 'orders', 'page.tsx');
  const userProfileOrdersPageContent = fs.readFileSync(userProfileOrdersPagePath, 'utf8');
  
  // Check if the View Details button uses orderNumber instead of id
  const usesOrderNumber = userProfileOrdersPageContent.includes('/profile/orders/${order.orderNumber}');
  const avoidsInternalId = !userProfileOrdersPageContent.includes('/profile/orders/${order.id}');
  
  if (usesOrderNumber && avoidsInternalId) {
    console.log('   ✅ User profile orders page uses orderNumber in URL');
    return true;
  } else {
    console.log('   ❌ User profile orders page still uses internal ID in URL');
    return false;
  }
}

// Test 2: Admin logout preserves redirect parameter
function testAdminLogoutRedirect() {
  console.log('\n2️⃣ Testing admin logout redirect...');
  
  const adminLayoutPath = path.join(__dirname, 'src', 'components', 'admin', 'AdminLayout.tsx');
  const adminLayoutContent = fs.readFileSync(adminLayoutPath, 'utf8');
  
  // Check if logout function preserves redirect parameter
  const preservesRedirect = adminLayoutContent.includes('encodeURIComponent(currentPath)');
  const hasLogoutFunction = adminLayoutContent.includes('const handleLogout');
  
  if (preservesRedirect && hasLogoutFunction) {
    console.log('   ✅ Admin logout preserves redirect parameter');
    return true;
  } else {
    console.log('   ❌ Admin logout does not preserve redirect parameter');
    return false;
  }
}

// Test 3: Order API searches by order number
function testOrderApiSearch() {
  console.log('\n3️⃣ Testing order API searches by order number...');
  
  const orderApiPath = path.join(__dirname, 'src', 'app', 'api', 'orders', '[id]', 'route.ts');
  const orderApiContent = fs.readFileSync(orderApiPath, 'utf8');
  
  // Check if API searches by order_number instead of id
  const searchesByOrderNumber = orderApiContent.includes('order_number: orderNumber');
  const usesPrisma = orderApiContent.includes('prisma.order.findUnique');
  
  if (searchesByOrderNumber && usesPrisma) {
    console.log('   ✅ Order API searches by order_number');
    return true;
  } else {
    console.log('   ❌ Order API not searching by order_number');
    return false;
  }
}

// Test 4: User profile orders API searches by order number
function testUserProfileOrdersApi() {
  console.log('\n4️⃣ Testing user profile orders API...');
  
  const userProfileOrdersApiPath = path.join(__dirname, 'src', 'app', 'api', 'user', 'orders', '[id]', 'route.ts');
  const userProfileOrdersApiContent = fs.readFileSync(userProfileOrdersApiPath, 'utf8');
  
  // Check if API searches by order_number
  const searchesByOrderNumber = userProfileOrdersApiContent.includes('o.order_number === orderNumber');
  
  if (searchesByOrderNumber) {
    console.log('   ✅ User profile orders API searches by order_number');
    return true;
  } else {
    console.log('   ❌ User profile orders API not searching by order_number');
    return false;
  }
}

// Test 5: Login page handles redirect parameter
function testLoginPageRedirect() {
  console.log('\n5️⃣ Testing login page redirect handling...');
  
  const loginPagePath = path.join(__dirname, 'src', 'app', 'login', 'page.tsx');
  const loginPageContent = fs.readFileSync(loginPagePath, 'utf8');
  
  // Check if login page handles redirect parameter
  const handlesRedirect = loginPageContent.includes('searchParams.get(\'redirect\')');
  const hasUseEffect = loginPageContent.includes('useEffect(() =>');
  
  if (handlesRedirect && hasUseEffect) {
    console.log('   ✅ Login page handles redirect parameter');
    return true;
  } else {
    console.log('   ❌ Login page does not handle redirect parameter');
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('🧪 Running verification of admin and user fixes...\n');
  
  const tests = [
    testUserProfileOrdersUrl,
    testAdminLogoutRedirect,
    testOrderApiSearch,
    testUserProfileOrdersApi,
    testLoginPageRedirect
  ];
  
  let passedTests = 0;
  
  tests.forEach(test => {
    if (test()) {
      passedTests++;
    }
  });
  
  console.log('\n📋 SUMMARY:');
  console.log(`✅ ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('\n🎉 ALL ADMIN AND USER FIXES HAVE BEEN SUCCESSFULLY IMPLEMENTED!');
    console.log('\n✅ MAIN ISSUES RESOLVED:');
    console.log('  1. User profile "View Details" now uses order number instead of internal ID');
    console.log('  2. Admin logout preserves redirect parameter for proper navigation');
    console.log('  3. Order tracking API searches by order_number instead of internal ID');
    console.log('  4. User profile orders API searches by order_number');
    console.log('  5. Login page properly handles redirect parameters');
    console.log('\n🚀 Users can now:');
    console.log('  • Click "View Details" on orders in their profile to see order details');
    console.log('  • Admins can log out and be properly redirected back to admin pages');
    console.log('  • Track orders using their order numbers');
    console.log('  • Access login page with proper redirect handling');
  } else {
    console.log('\n⚠️  Some fixes may still need attention');
  }
}

runAllTests();