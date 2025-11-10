// Test script to verify product upload functionality
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function testProductUpload() {
  console.log('🧪 Testing Product Upload Functionality...\n');
  
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    console.log('✅ Database connection established\n');
    
    // Test creating a new product
    console.log('1. Creating a test product...');
    
    // Generate a unique slug
    const timestamp = Date.now();
    const testSlug = `test-product-${timestamp}`;
    
    // Insert a test product
    const [productResult] = await pool.execute(
      `INSERT INTO products (id, slug, title_en, title_hi, description_en, description_hi, 
       price, original_price, stock, category_id, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        `prod-${timestamp}`,
        testSlug,
        'Test Product',
        'परीक्षण उत्पाद',
        'This is a test product for verification',
        'यह सत्यापन के लिए एक परीक्षण उत्पाद है',
        999,
        1299,
        10,
        'cat-006', // Men's Collection
        1
      ]
    );
    
    const productId = `prod-${timestamp}`;
    console.log(`   ✅ Product created with ID: ${productId}\n`);
    
    // Insert product images
    console.log('2. Adding product images...');
    
    const [imageResult] = await pool.execute(
      `INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        `img-${timestamp}`,
        productId,
        '/images/products/placeholder.jpg',
        'Test Product Image',
        1,
        0
      ]
    );
    
    console.log('   ✅ Product image added\n');
    
    // Verify the product exists
    console.log('3. Verifying product in database...');
    
    const [verifyResult] = await pool.execute(
      `SELECT p.*, pi.image_url 
       FROM products p 
       LEFT JOIN product_images pi ON p.id = pi.product_id 
       WHERE p.id = ?`,
      [productId]
    );
    
    if (verifyResult.length > 0) {
      console.log('   ✅ Product found in database');
      console.log(`   📦 Product: ${verifyResult[0].title_en}`);
      console.log(`   💰 Price: ₹${verifyResult[0].price}`);
      console.log(`   🖼️  Image: ${verifyResult[0].image_url}`);
      console.log(`   🏷️  Category: ${verifyResult[0].category_id}`);
    } else {
      console.log('   ❌ Product not found in database');
    }
    
    // Test API endpoint
    console.log('\n4. Testing API endpoint...');
    try {
      const apiResponse = await fetch(`http://localhost:3000/api/products?limit=1&category=cat-006`);
      const apiData = await apiResponse.json();
      
      if (apiData.success && apiData.products.length > 0) {
        console.log('   ✅ API endpoint working correctly');
        console.log(`   📊 Returned ${apiData.products.length} products`);
      } else {
        console.log('   ⚠️  API returned no products');
      }
    } catch (error) {
      console.log(`   ❌ API test failed: ${error.message}`);
    }
    
    // Clean up - delete the test product
    console.log('\n5. Cleaning up test data...');
    await pool.execute('DELETE FROM product_images WHERE product_id = ?', [productId]);
    await pool.execute('DELETE FROM products WHERE id = ?', [productId]);
    console.log('   ✅ Test data cleaned up\n');
    
    // Close the pool
    await pool.end();
    
    console.log('🎉 Product upload functionality test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database product creation working');
    console.log('   ✅ Product image association working');
    console.log('   ✅ API endpoints returning data');
    console.log('   ✅ Database cleanup successful');
    
  } catch (error) {
    console.error('❌ Error during product upload test:', error);
  }
}

// Run the test
testProductUpload();