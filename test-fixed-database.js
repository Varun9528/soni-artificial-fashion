const mysql = require('mysql2/promise');

// Test the fixed database implementation
async function testFixedDatabaseImplementation() {
  const config = {
    host: 'auth-db1555.hstgr.io',
    user: 'u632940212_u632940212_fas',
    password: 'Soni@2k25$$',
    database: 'u632940212_u632940212_son',
    port: 3306
  };

  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to Hostinger database successfully!');
    
    // Test fetching products with proper JSON parsing
    console.log('\n--- Testing Product Fetch with JSON Parsing ---');
    const [products] = await connection.execute(
      `SELECT p.*, c.name as category_name, a.name as artisan_name
       FROM products p
       LEFT JOIN categories c ON p.categoryId = c.id
       LEFT JOIN artisans a ON p.artisanId = a.id
       WHERE p.isActive = 1
       ORDER BY p.createdAt DESC
       LIMIT 3`
    );
    
    for (const product of products) {
      console.log(`\nProduct ID: ${product.id}`);
      console.log(`Slug: ${product.slug}`);
      
      // Parse JSON fields correctly
      const title = typeof product.title === 'string' ? JSON.parse(product.title) : product.title;
      const description = typeof product.description === 'string' ? JSON.parse(product.description) : product.description;
      
      console.log(`Title (EN): ${title.en}`);
      console.log(`Title (HI): ${title.hi}`);
      console.log(`Price: ${product.price}`);
      console.log(`Featured: ${product.featured}`);
      console.log(`Best Seller: ${product.bestSeller}`);
      console.log(`New Arrival: ${product.newArrival}`);
      
      // Get product images
      const [images] = await connection.execute(
        'SELECT * FROM product_images WHERE productId = ? ORDER BY sortOrder',
        [product.id]
      );
      
      console.log(`Images: ${images.length}`);
      for (const img of images) {
        console.log(`  - ${img.url} (Primary: ${img.isPrimary})`);
      }
    }
    
    // Test fetching featured products
    console.log('\n--- Testing Featured Products ---');
    const [featuredProducts] = await connection.execute(
      `SELECT COUNT(*) as count FROM products WHERE isActive = 1 AND featured = 1`
    );
    
    console.log(`Found ${featuredProducts[0].count} featured products`);
    
    // Test fetching new arrival products
    console.log('\n--- Testing New Arrival Products ---');
    const [newArrivalProducts] = await connection.execute(
      `SELECT COUNT(*) as count FROM products WHERE isActive = 1 AND newArrival = 1`
    );
    
    console.log(`Found ${newArrivalProducts[0].count} new arrival products`);
    
    // Test fetching best seller products
    console.log('\n--- Testing Best Seller Products ---');
    const [bestSellerProducts] = await connection.execute(
      `SELECT COUNT(*) as count FROM products WHERE isActive = 1 AND bestSeller = 1`
    );
    
    console.log(`Found ${bestSellerProducts[0].count} best seller products`);
    
    // Test fetching categories
    console.log('\n--- Testing Categories ---');
    const [categories] = await connection.execute(
      `SELECT * FROM categories WHERE isActive = 1 ORDER BY sortOrder`
    );
    
    console.log(`Found ${categories.length} categories`);
    for (const category of categories) {
      const name = typeof category.name === 'string' ? JSON.parse(category.name) : category.name;
      console.log(`  - ${name.en} (${category.id})`);
    }
    
    await connection.end();
    console.log('\n✅ All database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:');
    console.error('Error message:', error.message);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

testFixedDatabaseImplementation();