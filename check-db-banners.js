const mysql = require('mysql2/promise');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function checkBanners() {
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Get all banners from the database
    const [rows] = await pool.execute('SELECT * FROM banners ORDER BY display_order');
    
    console.log('Banners in database:');
    console.log('====================');
    
    if (rows.length === 0) {
      console.log('No banners found in database');
      return;
    }
    
    rows.forEach((banner, index) => {
      console.log(`Banner ${index + 1}:`);
      console.log(`  ID: ${banner.id}`);
      console.log(`  Title (EN): ${banner.title_en}`);
      console.log(`  Title (HI): ${banner.title_hi}`);
      console.log(`  Subtitle (EN): ${banner.subtitle_en}`);
      console.log(`  Subtitle (HI): ${banner.subtitle_hi}`);
      console.log(`  Image Desktop: ${banner.image_desktop}`);
      console.log(`  Image Mobile: ${banner.image_mobile}`);
      console.log(`  Link URL: ${banner.link_url}`);
      console.log(`  Display Order: ${banner.display_order}`);
      console.log(`  Is Active: ${banner.is_active}`);
      console.log('---');
    });
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error checking banners:', error);
  }
}

checkBanners();