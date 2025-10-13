const db = require('./lib/db');

async function testDatabaseAdapter() {
  console.log('Testing Database Adapter...');
  
  try {
    // Test findMany
    const users = await db.findMany('users');
    console.log(`✅ Found ${users.length} users`);
    
    // Test findUnique
    const adminUser = await db.findUnique('users', { email: 'admin@pachmarhi.com' });
    if (adminUser) {
      console.log(`✅ Admin user found: ${adminUser.name}`);
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Test findMany with where clause
    const categories = await db.findMany('categories', { is_active: 1 });
    console.log(`✅ Found ${categories.length} active categories`);
    
    // Test findMany with select
    const productNames = await db.findMany('products', {}, 'title_en, price');
    console.log(`✅ Found ${productNames.length} products with selected fields`);
    productNames.forEach(product => {
      console.log(`  - ${product.title_en}: ₹${product.price}`);
    });
    
    console.log('\n🎉 Database adapter test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database adapter test failed:', error.message);
  }
}

testDatabaseAdapter();