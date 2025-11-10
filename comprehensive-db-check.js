const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function comprehensiveDbCheck() {
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    console.log('Connected to the database successfully!');
    
    // Check all tables for references to problematic images
    console.log('\n=== Checking for test.jpg references ===');
    
    // Check products table
    const [productRows] = await pool.execute(
      `SELECT p.id, p.slug, p.title_en FROM products p 
       JOIN product_images pi ON p.id = pi.product_id 
       WHERE pi.image_url LIKE '%test%'`
    );
    
    if (productRows.length > 0) {
      console.log('Found test.jpg references in products:');
      for (const row of productRows) {
        console.log(`  Product: ${row.title_en} (${row.slug})`);
      }
    } else {
      console.log('✓ No test.jpg references found in products');
    }
    
    // Check banners table
    const [bannerRows] = await pool.execute(
      `SELECT id, title_en FROM banners 
       WHERE image_desktop LIKE '%test%' OR image_mobile LIKE '%test%'`
    );
    
    if (bannerRows.length > 0) {
      console.log('Found test.jpg references in banners:');
      for (const row of bannerRows) {
        console.log(`  Banner: ${row.title_en}`);
      }
    } else {
      console.log('✓ No test.jpg references found in banners');
    }
    
    // Check categories table
    const [categoryRows] = await pool.execute(
      `SELECT id, name_en FROM categories 
       WHERE image LIKE '%test%'`
    );
    
    if (categoryRows.length > 0) {
      console.log('Found test.jpg references in categories:');
      for (const row of categoryRows) {
        console.log(`  Category: ${row.name_en}`);
      }
    } else {
      console.log('✓ No test.jpg references found in categories');
    }
    
    // Check artisans table
    const [artisanRows] = await pool.execute(
      `SELECT id, name FROM artisans 
       WHERE avatar LIKE '%test%'`
    );
    
    if (artisanRows.length > 0) {
      console.log('Found test.jpg references in artisans:');
      for (const row of artisanRows) {
        console.log(`  Artisan: ${row.name}`);
      }
    } else {
      console.log('✓ No test.jpg references found in artisans');
    }
    
    // Check if the placeholder.jpg file exists
    console.log('\n=== Checking image files ===');
    const fs = require('fs');
    const path = require('path');
    
    const imageFilesToCheck = [
      'public/images/products/placeholder.jpg',
      'public/images/products/test.jpg',
      'public/images/banner/test-banner.png',
      'public/images/banner/test-banner-mobile.png'
    ];
    
    for (const file of imageFilesToCheck) {
      const fullPath = path.join(__dirname, file);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`✓ ${file} exists (${stats.size} bytes)`);
      } else {
        console.log(`✗ ${file} does not exist`);
      }
    }
    
    // Close the pool
    await pool.end();
    
    console.log('\n=== Database and file check completed ===');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

comprehensiveDbCheck();