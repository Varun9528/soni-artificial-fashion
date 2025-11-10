const mysql = require('mysql2/promise');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function seedDatabase() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Create admin user
    try {
      const adminUserQuery = `
        INSERT INTO users (id, email, password_hash, name, role, email_verified, created_at, updated_at)
        VALUES ('admin-001', 'admin@soniartificialfashion.com', '$2a$12$TVb7ROjbz2CJFo3K71MBGunOtW7G7NUJhIk0p6aWK4aVQJ0CaCYsO', 'Admin User', 'super_admin', 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE email=email
      `;
      await connection.execute(adminUserQuery);
      console.log('✅ Created/verified admin user');
    } catch (error) {
      console.log('Admin user might already exist, continuing...');
    }
    
    // Create jewelry categories
    const categories = [
      ['cat-001', 'Jewelry', 'आभूषण', 'Beautiful artificial jewelry crafted with precision and elegance', 'सुंदर कृत्रिम आभूषण जो परिशुद्धता और सौंदर्य के साथ बनाया गया है', '/images/categories/jewelry.jpg', 1, 1],
      ['cat-002', 'Necklaces', 'हार', 'Elegant necklaces for every occasion', 'प्रत्येक अवसर के लिए सुरुचिपूर्ण हार', '/images/categories/necklaces.jpg', 2, 1],
      ['cat-003', 'Earrings', 'कान के आभूषण', 'Stylish earrings to complement your look', 'आपके स्वरूप को पूरा करने के लिए फैशनेबल कान के आभूषण', '/images/categories/earrings.jpg', 3, 1],
      ['cat-004', 'Bracelets', 'कंघाइयाँ', 'Chic bracelets for a fashionable touch', 'फैशनेबल स्पर्श के लिए चिक कंघाइयाँ', '/images/categories/bracelets.jpg', 4, 1],
      ['cat-005', 'Rings', 'अंगूठियाँ', 'Beautiful rings to adorn your fingers', 'आपकी अंगुलियों को सजाने के लिए सुंदर अंगूठियाँ', '/images/categories/rings.jpg', 5, 1],
      ['cat-006', 'Men Collection', 'पुरुष संग्रह', 'Elegant jewelry collection designed exclusively for men', 'पुरुषों के लिए विशेष रूप से डिज़ाइन किया गया सुरुचिपूर्ण आभूषण संग्रह', '/images/men collection/Gold_Figaro_Bracelet_Studio_Shot.png', 6, 1],
      ['cat-007', 'Women Collection', 'महिला संग्रह', 'Exquisite jewelry collection crafted for the modern woman', 'आधुनिक महिला के लिए तैयार किया गया शानदार आभूषण संग्रह', '/images/women collection/Golden_Radiance_Portrait.png', 7, 1]
    ];
    
    for (const category of categories) {
      try {
        const categoryQuery = `
          INSERT INTO categories (id, name_en, name_hi, description_en, description_hi, image, display_order, is_active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE name_en=name_en
        `;
        await connection.execute(categoryQuery, category);
        console.log(`✅ Created/verified category: ${category[1]}`);
      } catch (error) {
        console.log(`Category ${category[1]} might already exist, continuing...`);
      }
    }
    
    // Create artisans
    const artisans = [
      ['art-001', 'Soni Designer', 'Master craftsman with 15 years of experience in jewelry making', '15 वर्षों के आभूषण बनाने के अनुभव वाले मास्टर कारीगर', 'Gold Plating, Stone Setting', 'Delhi, India', 15, 4.9, 1],
      ['art-002', 'Priya Crafts', 'Skilled artisan specializing in traditional jewelry designs', 'पारंपरिक आभूषण डिज़ाइन में विशेषज्ञ कारीगर', 'Traditional Designs, Beading', 'Mumbai, India', 12, 4.7, 1]
    ];
    
    for (const artisan of artisans) {
      try {
        const artisanQuery = `
          INSERT INTO artisans (id, name, bio_en, bio_hi, specialization, location, experience_years, rating, is_verified, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE name=name
        `;
        await connection.execute(artisanQuery, artisan);
        console.log(`✅ Created/verified artisan: ${artisan[1]}`);
      } catch (error) {
        console.log(`Artisan ${artisan[1]} might already exist, continuing...`);
      }
    }
    
    // Create jewelry products
    const products = [
      ['prod-001', 'gold-necklace-set', JSON.stringify({en: 'Gold Necklace Set', hi: 'गोल्ड नेकलेस सेट'}), JSON.stringify({en: 'Elegant gold-plated necklace set with traditional design', hi: 'पारंपरिक डिज़ाइन के साथ सुरुचिपूर्ण सोने की प्लेटेड हार सेट'}), 2499, 3499, 'SKU-001', 15, 'cat-002', 'art-001'],
      ['prod-002', 'royal-earrings', JSON.stringify({en: 'Royal Earrings', hi: 'रॉयल इयररिंग्स'}), JSON.stringify({en: 'Stylish gold-plated earrings for special occasions', hi: 'विशेष अवसरों के लिए फैशनेबल सोने की प्लेटेड कान के आभूषण'}), 899, 1299, 'SKU-002', 25, 'cat-003', 'art-001'],
      ['prod-003', 'geometric-bracelet', JSON.stringify({en: 'Geometric Bracelet', hi: 'जियोमेट्रिक ब्रेसलेट'}), JSON.stringify({en: 'Modern geometric design gold-plated bracelet', hi: 'आधुनिक ज्यामितीय डिज़ाइन सोने की प्लेटेड कंघाई'}), 1299, 1799, 'SKU-003', 20, 'cat-004', 'art-001']
    ];
    
    for (const product of products) {
      try {
        // Check if product already exists
        const [existing] = await connection.execute('SELECT id FROM products WHERE id = ?', [product[0]]);
        
        if (existing.length === 0) {
          const productQuery = `
            INSERT INTO products (id, slug, title, description, price, originalPrice, sku, stock, categoryId, artisanId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `;
          await connection.execute(productQuery, product);
          
          // Create product image
          const imageQuery = `
            INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
          `;
          await connection.execute(imageQuery, [`img-${product[0].substring(5)}`, product[0], `/images/products/${product[0]}.png`, product[2], 1]);
          
          console.log(`✅ Created product: ${JSON.parse(product[2]).en} (${product[0]})`);
        } else {
          console.log(`Product already exists: ${product[0]}`);
        }
      } catch (error) {
        console.log(`Error creating product ${product[0]}:`, error.message);
      }
    }
    
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
    
    console.log('✅ Database seeding completed successfully!');
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database seeding failed:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

seedDatabase();