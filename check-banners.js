const mysql = require('mysql2/promise');

// Database configuration
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
    
    // Query all banners
    const [rows] = await pool.execute('SELECT * FROM banners ORDER BY display_order');
    
    console.log('Found', rows.length, 'banners in database:');
    console.log('----------------------------------------');
    
    for (const banner of rows) {
      console.log('ID:', banner.id);
      console.log('Title (EN):', banner.title_en);
      console.log('Title (HI):', banner.title_hi);
      console.log('Subtitle (EN):', banner.subtitle_en);
      console.log('Subtitle (HI):', banner.subtitle_hi);
      console.log('Image Desktop:', banner.image_desktop);
      console.log('Image Mobile:', banner.image_mobile);
      console.log('Link URL:', banner.link_url);
      console.log('Is Active:', banner.is_active);
      console.log('Display Order:', banner.display_order);
      console.log('----------------------------------------');
    }
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error checking banners:', error);
  }
}

checkBanners();