const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function checkDatabaseImages() {
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    console.log('Connected to the database successfully!');
    
    // Check product images
    console.log('\n=== Product Images in Database ===');
    const [productRows] = await pool.execute(`
      SELECT p.id, p.slug, p.title_en, pi.image_url 
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id 
      ORDER BY p.created_at DESC
      LIMIT 20
    `);
    
    for (const product of productRows) {
      console.log(`Product: ${product.title_en} (${product.slug})`);
      console.log(`  Image: ${product.image_url}`);
    }
    
    // Check banner images
    console.log('\n=== Banner Images in Database ===');
    const [bannerRows] = await pool.execute(`
      SELECT id, title_en, image_desktop, image_mobile 
      FROM banners 
      ORDER BY display_order
    `);
    
    for (const banner of bannerRows) {
      console.log(`Banner: ${banner.title_en}`);
      console.log(`  Desktop: ${banner.image_desktop}`);
      console.log(`  Mobile: ${banner.image_mobile}`);
    }
    
    // Check category images
    console.log('\n=== Category Images in Database ===');
    const [categoryRows] = await pool.execute(`
      SELECT id, name_en, image 
      FROM categories 
      ORDER BY display_order
    `);
    
    for (const category of categoryRows) {
      console.log(`Category: ${category.name_en}`);
      console.log(`  Image: ${category.image}`);
    }
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

checkDatabaseImages();