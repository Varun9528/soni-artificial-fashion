const mysql = require('mysql2/promise');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function createBanners() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Create banners
    const banners = [
      ['banner-001', 'Gold Collection', 'सोने का संग्रह', 'Premium Gold Plated Jewelry', 'प्रीमियम सोने की प्लेटेड आभूषण', '/images/banner/banner1.png', '/images/banner/banner1.png', '/category/jewelry', 1, 1],
      ['banner-002', 'Earring Specials', 'कान के आभूषण विशेष', 'Statement Earrings', 'वक्तव्य कान के आभूषण', '/images/banner/banner2.png', '/images/banner/banner2.png', '/category/earrings', 2, 1],
      ['banner-003', 'Special Offers', 'विशेष प्रस्ताव', 'Limited Time Deals', 'सीमित समय के सौदे', '/images/banner/banner3.png', '/images/banner/banner3.png', '/products', 3, 1]
    ];
    
    for (const banner of banners) {
      try {
        const bannerQuery = `
          INSERT INTO banners (id, title_en, title_hi, subtitle_en, subtitle_hi, image_desktop, image_mobile, link_url, display_order, is_active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE title_en=title_en
        `;
        await connection.execute(bannerQuery, banner);
        console.log(`✅ Created/verified banner: ${banner[1]}`);
      } catch (error) {
        console.log(`Banner ${banner[1]} might already exist, continuing...`);
      }
    }
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Banner creation failed:');
    console.error('Error message:', error.message);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

createBanners();