const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function fixDatabaseImages() {
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    console.log('Connected to the database successfully!');
    
    // Fix product images that reference non-existent files
    console.log('\n=== Fixing Product Images ===');
    
    // Fix test.jpg references
    const [testProductResult] = await pool.execute(
      `UPDATE product_images 
       SET image_url = '/images/products/placeholder.jpg' 
       WHERE image_url = '/images/products/test.jpg'`
    );
    console.log(`Fixed ${testProductResult.affectedRows} test.jpg references`);
    
    // Fix men's product image with space in filename
    const [menProductResult] = await pool.execute(
      `UPDATE product_images 
       SET image_url = '/images/mens product/Gold_Bracelet_Marble_Macro_Luxury (2).png' 
       WHERE image_url = '/images/mens product/Gold_Bracelets_Marble_Macro_Luxury (2).png'`
    );
    console.log(`Fixed ${menProductResult.affectedRows} men's product image references`);
    
    // Fix banner images that reference non-existent files
    console.log('\n=== Fixing Banner Images ===');
    
    const [bannerResult] = await pool.execute(
      `UPDATE banners 
       SET image_desktop = '/images/banner/banner1.png', 
           image_mobile = '/images/banner/banner1.png' 
       WHERE image_desktop = '/images/banner/test-banner.png' 
          OR image_mobile = '/images/banner/test-banner-mobile.png'`
    );
    console.log(`Fixed ${bannerResult.affectedRows} banner references`);
    
    // Verify the fixes
    console.log('\n=== Verification ===');
    
    // Check product images
    const [productRows] = await pool.execute(`
      SELECT p.id, p.slug, p.title_en, pi.image_url 
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id 
      WHERE pi.image_url LIKE '%test%' OR pi.image_url LIKE '%Bracelets_Marble%'
      ORDER BY p.created_at DESC
    `);
    
    if (productRows.length === 0) {
      console.log('✓ All product images fixed successfully');
    } else {
      console.log('⚠ Still have issues with product images:');
      for (const product of productRows) {
        console.log(`  Product: ${product.title_en} (${product.slug})`);
        console.log(`    Image: ${product.image_url}`);
      }
    }
    
    // Check banner images
    const [bannerRows] = await pool.execute(`
      SELECT id, title_en, image_desktop, image_mobile 
      FROM banners 
      WHERE image_desktop LIKE '%test%' OR image_mobile LIKE '%test%'
    `);
    
    if (bannerRows.length === 0) {
      console.log('✓ All banner images fixed successfully');
    } else {
      console.log('⚠ Still have issues with banner images:');
      for (const banner of bannerRows) {
        console.log(`  Banner: ${banner.title_en}`);
        console.log(`    Desktop: ${banner.image_desktop}`);
        console.log(`    Mobile: ${banner.image_mobile}`);
      }
    }
    
    // Close the pool
    await pool.end();
    
    console.log('\n=== Database image fixes completed ===');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

fixDatabaseImages();