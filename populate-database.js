const mysql = require('mysql2/promise');

// Hostinger database configuration
const config = {
  host: 'auth-db1555.hstgr.io',
  user: 'u632940212_u632940212_fas',
  password: 'Soni@2k25$$',
  database: 'u632940212_u632940212_son',
  port: 3306
};

async function populateDatabase() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection(config);
    console.log('Connected to Hostinger database successfully!');
    
    // Create more categories
    const categories = [
      ['cat-001', JSON.stringify({en: 'Jewelry', hi: 'आभूषण'}), 'jewelry', JSON.stringify({en: 'Beautiful artificial jewelry crafted with precision and elegance', hi: 'सुंदर कृत्रिम आभूषण जो परिशुद्धता और सौंदर्य के साथ बनाया गया है'}), '/images/categories/jewelry.jpg', 1, 1, 0, 1],
      ['cat-002', JSON.stringify({en: 'Necklaces', hi: 'हार'}), 'necklaces', JSON.stringify({en: 'Elegant necklaces for every occasion', hi: 'प्रत्येक अवसर के लिए सुरुचिपूर्ण हार'}), '/images/categories/necklaces.jpg', 1, 1, 0, 2],
      ['cat-003', JSON.stringify({en: 'Earrings', hi: 'कान के आभूषण'}), 'earrings', JSON.stringify({en: 'Stylish earrings to complement your look', hi: 'आपके स्वरूप को पूरा करने के लिए फैशनेबल कान के आभूषण'}), '/images/categories/earrings.jpg', 1, 1, 0, 3],
      ['cat-004', JSON.stringify({en: 'Bracelets', hi: 'कंघाइयाँ'}), 'bracelets', JSON.stringify({en: 'Chic bracelets for a fashionable touch', hi: 'फैशनेबल स्पर्श के लिए चिक कंघाइयाँ'}), '/images/categories/bracelets.jpg', 1, 1, 0, 4],
      ['cat-005', JSON.stringify({en: 'Rings', hi: 'अंगूठियाँ'}), 'rings', JSON.stringify({en: 'Beautiful rings to adorn your fingers', hi: 'आपकी अंगुलियों को सजाने के लिए सुंदर अंगूठियाँ'}), '/images/categories/rings.jpg', 1, 1, 0, 5],
      ['cat-006', JSON.stringify({en: 'Men Collection', hi: 'पुरुष संग्रह'}), 'men-collection', JSON.stringify({en: 'Elegant jewelry collection designed exclusively for men', hi: 'पुरुषों के लिए विशेष रूप से डिज़ाइन किया गया सुरुचिपूर्ण आभूषण संग्रह'}), '/images/categories/cat-006.jpg', 1, 1, 0, 6],
      ['cat-007', JSON.stringify({en: 'Women Collection', hi: 'महिला संग्रह'}), 'women-collection', JSON.stringify({en: 'Exquisite jewelry collection crafted for the modern woman', hi: 'आधुनिक महिला के लिए तैयार किया गया शानदार आभूषण संग्रह'}), '/images/categories/cat-007.jpg', 1, 1, 0, 7]
    ];
    
    for (const category of categories) {
      try {
        const categoryQuery = `
          INSERT INTO categories (id, name, slug, description, image, featured, isActive, productCount, sortOrder, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE name=name
        `;
        await connection.execute(categoryQuery, category);
        console.log(`✅ Created/verified category: ${JSON.parse(category[1]).en}`);
      } catch (error) {
        console.log(`Category ${JSON.parse(category[1]).en} might already exist, continuing...`);
      }
    }
    
    // Create more artisans
    const artisans = [
      ['art-001', 'Soni Designer', 'soni-designer', JSON.stringify({en: 'Master craftsman with 15 years of experience in jewelry making', hi: '15 वर्षों के आभूषण बनाने के अनुभव वाले मास्टर कारीगर'}), 'Delhi', 'Delhi', 'Delhi', null, 15, 4.9, 0, 1],
      ['art-002', 'Priya Crafts', 'priya-crafts', JSON.stringify({en: 'Skilled artisan specializing in traditional jewelry designs', hi: 'पारंपरिक आभूषण डिज़ाइन में विशेषज्ञ कारीगर'}), 'Mumbai', 'Mumbai', 'Maharashtra', null, 12, 4.7, 0, 1],
      ['art-003', 'Rajesh Goldsmith', 'rajesh-goldsmith', JSON.stringify({en: 'Expert in gold plating and traditional techniques', hi: 'सोने की प्लेटिंग और पारंपरिक तकनीकों में विशेषज्ञ'}), 'Jaipur', 'Jaipur', 'Rajasthan', null, 10, 4.8, 0, 1],
      ['art-004', 'Meena Creations', 'meena-creations', JSON.stringify({en: 'Specialist in contemporary jewelry designs', hi: 'समकालीन आभूषण डिज़ाइन में विशेषज्ञ'}), 'Hyderabad', 'Hyderabad', 'Telangana', null, 8, 4.6, 0, 1]
    ];
    
    for (const artisan of artisans) {
      try {
        const artisanQuery = `
          INSERT INTO artisans (id, name, slug, bio, village, district, state, photo, experience, rating, totalProducts, isActive, joinedAt, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
          ON DUPLICATE KEY UPDATE name=name
        `;
        await connection.execute(artisanQuery, artisan);
        console.log(`✅ Created/verified artisan: ${artisan[1]}`);
      } catch (error) {
        console.log(`Artisan ${artisan[1]} might already exist, continuing...`);
      }
    }
    
    // Create more products with all available images
    const products = [
      // Jewelry products
      ['prod-001', 'gold-necklace-set', JSON.stringify({en: 'Gold Necklace Set', hi: 'गोल्ड नेकलेस सेट'}), JSON.stringify({en: 'Elegant gold-plated necklace set with traditional design', hi: 'पारंपरिक डिज़ाइन के साथ सुरुचिपूर्ण सोने की प्लेटेड हार सेट'}), 2499, 3499, 'SKU-001', 15, 'cat-002', 'art-001'],
      ['prod-002', 'royal-earrings', JSON.stringify({en: 'Royal Earrings', hi: 'रॉयल इयररिंग्स'}), JSON.stringify({en: 'Stylish gold-plated earrings for special occasions', hi: 'विशेष अवसरों के लिए फैशनेबल सोने की प्लेटेड कान के आभूषण'}), 899, 1299, 'SKU-002', 25, 'cat-003', 'art-001'],
      ['prod-003', 'geometric-bracelet', JSON.stringify({en: 'Geometric Bracelet', hi: 'जियोमेट्रिक ब्रेसलेट'}), JSON.stringify({en: 'Modern geometric design gold-plated bracelet', hi: 'आधुनिक ज्यामितीय डिज़ाइन सोने की प्लेटेड कंघाई'}), 1299, 1799, 'SKU-003', 20, 'cat-004', 'art-001'],
      ['prod-004', 'diamond-ring', JSON.stringify({en: 'Diamond Ring', hi: 'डायमंड रिंग'}), JSON.stringify({en: 'Elegant diamond-studded gold ring', hi: 'सुरुचिपूर्ण हीरा जड़ित सोने की अंगूठी'}), 3499, 4999, 'SKU-004', 10, 'cat-005', 'art-002'],
      ['prod-005', 'gold-anklet', JSON.stringify({en: 'Gold Anklet', hi: 'गोल्ड एंकलेट'}), JSON.stringify({en: 'Traditional gold-plated anklet for daily wear', hi: 'दैनिक पहनने के लिए पारंपरिक सोने की प्लेटेड एंकलेट'}), 1599, 2199, 'SKU-005', 18, 'cat-001', 'art-002'],
      ['prod-006', 'mangalsutra-set', JSON.stringify({en: 'Mangalsutra Set', hi: 'मांगलसूत्र सेट'}), JSON.stringify({en: 'Traditional mangalsutra with modern touch', hi: 'आधुनिक स्पर्श के साथ पारंपरिक मांगलसूत्र'}), 2999, 3999, 'SKU-006', 8, 'cat-007', 'art-002'],
      ['prod-007', 'gold-hair-chain', JSON.stringify({en: 'Gold Hair Chain', hi: 'गोल्ड हेयर चेन'}), JSON.stringify({en: 'Elegant gold-plated hair chain for special occasions', hi: 'विशेष अवसरों के लिए सुरुचिपूर्ण सोने की प्लेटेड हेयर चेन'}), 1799, 2499, 'SKU-007', 12, 'cat-001', 'art-003'],
      ['prod-008', 'gold-nose-ring', JSON.stringify({en: 'Gold Nose Ring', hi: 'गोल्ड नोज रिंग'}), JSON.stringify({en: 'Traditional gold-plated nose ring', hi: 'पारंपरिक सोने की प्लेटेड नोज रिंग'}), 799, 1099, 'SKU-008', 30, 'cat-001', 'art-003'],
      ['prod-009', 'gold-bracelet', JSON.stringify({en: 'Gold Bracelet', hi: 'गोल्ड ब्रेसलेट'}), JSON.stringify({en: 'Stylish gold-plated bracelet for men', hi: 'पुरुषों के लिए फैशनेबल सोने की प्लेटेड कंघाई'}), 1599, 2199, 'SKU-009', 15, 'cat-006', 'art-001'],
      ['prod-010', 'gold-bangles-set', JSON.stringify({en: 'Golden Bangles Set', hi: 'गोल्डन बांगल्स सेट'}), JSON.stringify({en: 'Beautiful set of golden bangles for women', hi: 'महिलाओं के लिए सुंदर सोने की प्लेटेड बांगड़ों का सेट'}), 1799, 2499, 'SKU-010', 18, 'cat-007', 'art-002'],
      ['prod-011', 'elegant-gold-ring', JSON.stringify({en: 'Elegant Gold Ring', hi: 'एलिगेंट गोल्ड रिंग'}), JSON.stringify({en: 'Beautiful gold-plated ring for women', hi: 'महिलाओं के लिए सुंदर सोने की प्लेटेड अंगूठी'}), 1299, 1899, 'SKU-011', 22, 'cat-007', 'art-002'],
      ['prod-012', 'gold-necklace-women', JSON.stringify({en: 'Gold Necklace for Women', hi: 'महिलाओं के लिए गोल्ड नेकलेस'}), JSON.stringify({en: 'Exquisite gold-plated necklace for women', hi: 'महिलाओं के लिए शानदार सोने की प्लेटेड हार'}), 2799, 3799, 'SKU-012', 12, 'cat-007', 'art-001'],
      ['prod-013', 'antique-bangles', JSON.stringify({en: 'Antique Bangles', hi: 'एंटीक बांगल्स'}), JSON.stringify({en: 'Beautiful antique style bangles', hi: 'सुंदर एंटीक शैली के बांगल्स'}), 1999, 2799, 'SKU-013', 14, 'cat-004', 'art-003'],
      ['prod-014', 'gold-choker', JSON.stringify({en: 'Gold Choker', hi: 'गोल्ड चॉकर'}), JSON.stringify({en: 'Elegant gold-plated choker necklace', hi: 'सुरुचिपूर्ण सोने की प्लेटेड चॉकर हार'}), 2199, 2999, 'SKU-014', 9, 'cat-002', 'art-004'],
      ['prod-015', 'pearl-jhumka', JSON.stringify({en: 'Pearl Jhumka', hi: 'पर्ल झुमका'}), JSON.stringify({en: 'Beautiful pearl jhumka earrings', hi: 'सुंदर मोती के झुमके'}), 1699, 2399, 'SKU-015', 16, 'cat-003', 'art-004'],
      ['prod-016', 'gold-maang-tikka', JSON.stringify({en: 'Gold Maang Tikka', hi: 'गोल्ड मांग टिका'}), JSON.stringify({en: 'Traditional gold-plated maang tikka', hi: 'पारंपरिक सोने की प्लेटेड मांग टिका'}), 2599, 3599, 'SKU-016', 7, 'cat-001', 'art-002'],
      ['prod-017', 'gold-kamarbandh', JSON.stringify({en: 'Gold Kamarbandh', hi: 'गोल्ड कमरबंध'}), JSON.stringify({en: 'Traditional gold-plated waist chain', hi: 'पारंपरिक सोने की प्लेटेड कमरबंध'}), 2299, 3199, 'SKU-017', 11, 'cat-001', 'art-003'],
      ['prod-018', 'gold-toe-rings', JSON.stringify({en: 'Gold Toe Rings', hi: 'गोल्ड टो रिंग्स'}), JSON.stringify({en: 'Traditional gold-plated toe rings set', hi: 'पारंपरिक सोने की प्लेटेड टो रिंग्स का सेट'}), 899, 1299, 'SKU-018', 25, 'cat-001', 'art-004'],
      ['prod-019', 'gold-hairpin', JSON.stringify({en: 'Gold Hairpin', hi: 'गोल्ड हेयरपिन'}), JSON.stringify({en: 'Elegant gold-plated hairpin', hi: 'सुरुचिपूर्ण सोने की प्लेटेड हेयरपिन'}), 699, 999, 'SKU-019', 28, 'cat-001', 'art-001'],
      ['prod-020', 'gold-cufflinks', JSON.stringify({en: 'Gold Cufflinks', hi: 'गोल्ड कफलिंक्स'}), JSON.stringify({en: 'Premium gold-plated cufflinks for men', hi: 'पुरुषों के लिए प्रीमियम सोने की प्लेटेड कफलिंक्स'}), 1899, 2699, 'SKU-020', 13, 'cat-006', 'art-003'],
      
      // Men's products
      ['prod-021', 'mens-gold-chain', JSON.stringify({en: 'Men\'s Gold Chain', hi: 'पुरुषों के लिए गोल्ड चेन'}), JSON.stringify({en: 'Premium gold-plated chain for men', hi: 'पुरुषों के लिए प्रीमियम सोने की प्लेटेड चेन'}), 1899, 2499, 'SKU-021', 12, 'cat-006', 'art-001'],
      ['prod-022', 'luxury-gold-watch', JSON.stringify({en: 'Luxury Gold Watch', hi: 'लक्ज़री गोल्ड वॉच'}), JSON.stringify({en: 'Premium luxury gold-plated watch for men', hi: 'पुरुषों के लिए प्रीमियम लक्ज़री सोने की प्लेटेड घड़ी'}), 4999, 6999, 'SKU-022', 7, 'cat-006', 'art-001'],
      ['prod-023', 'gold-pendant-men', JSON.stringify({en: 'Gold Pendant for Men', hi: 'पुरुषों के लिए गोल्ड पेंडेंट'}), JSON.stringify({en: 'Elegant gold-plated pendant for men', hi: 'पुरुषों के लिए सुरुचिपूर्ण सोने की प्लेटेड पेंडेंट'}), 2299, 3299, 'SKU-023', 10, 'cat-006', 'art-002'],
      ['prod-024', 'gold-bracelet-men', JSON.stringify({en: 'Gold Bracelet for Men', hi: 'पुरुषों के लिए गोल्ड ब्रेसलेट'}), JSON.stringify({en: 'Stylish gold-plated bracelet for men', hi: 'पुरुषों के लिए फैशनेबल सोने की प्लेटेड कंघाई'}), 1599, 2199, 'SKU-024', 15, 'cat-006', 'art-001'],
      ['prod-025', 'gold-ring-men', JSON.stringify({en: 'Gold Ring for Men', hi: 'पुरुषों के लिए गोल्ड रिंग'}), JSON.stringify({en: 'Elegant gold-plated ring for men', hi: 'पुरुषों के लिए सुरुचिपूर्ण सोने की प्लेटेड अंगूठी'}), 1999, 2799, 'SKU-025', 18, 'cat-006', 'art-003'],
      ['prod-026', 'gold-kada', JSON.stringify({en: 'Gold Kada', hi: 'गोल्ड कड़ा'}), JSON.stringify({en: 'Traditional gold-plated kada for men', hi: 'पुरुषों के लिए पारंपरिक सोने की प्लेटेड कड़ा'}), 2199, 2999, 'SKU-026', 9, 'cat-006', 'art-004'],
      ['prod-027', 'kohli-chain', JSON.stringify({en: 'Kohli Chain', hi: 'कोहली चेन'}), JSON.stringify({en: 'Special Kohli style gold chain', hi: 'विशेष कोहली शैली की सोने की चेन'}), 2399, 3399, 'SKU-027', 8, 'cat-006', 'art-001'],
      ['prod-028', 'gold-money-clip', JSON.stringify({en: 'Gold Money Clip', hi: 'गोल्ड मनी क्लिप'}), JSON.stringify({en: 'Premium gold-plated money clip', hi: 'प्रीमियम सोने की प्लेटेड मनी क्लिप'}), 1299, 1899, 'SKU-028', 20, 'cat-006', 'art-002'],
      ['prod-029', 'gold-signet-ring', JSON.stringify({en: 'Gold Signet Ring', hi: 'गोल्ड सिग्नेट रिंग'}), JSON.stringify({en: 'Classic gold-plated signet ring', hi: 'क्लासिक सोने की प्लेटेड सिग्नेट अंगूठी'}), 2799, 3899, 'SKU-029', 6, 'cat-006', 'art-003'],
      ['prod-030', 'gold-tie-clip', JSON.stringify({en: 'Gold Tie Clip', hi: 'गोल्ड टाई क्लिप'}), JSON.stringify({en: 'Elegant gold-plated tie clip', hi: 'सुरुचिपूर्ण सोने की प्लेटेड टाई क्लिप'}), 999, 1499, 'SKU-030', 22, 'cat-006', 'art-004'],
      
      // Women's products
      ['prod-031', 'golden-bangles-set', JSON.stringify({en: 'Golden Bangles Set', hi: 'गोल्डन बांगल्स सेट'}), JSON.stringify({en: 'Beautiful set of golden bangles for women', hi: 'महिलाओं के लिए सुंदर सोने की प्लेटेड बांगड़ों का सेट'}), 1799, 2499, 'SKU-031', 18, 'cat-007', 'art-002'],
      ['prod-032', 'golden-ring', JSON.stringify({en: 'Golden Ring', hi: 'गोल्डन रिंग'}), JSON.stringify({en: 'Beautiful gold-plated ring for women', hi: 'महिलाओं के लिए सुंदर सोने की प्लेटेड अंगूठी'}), 1299, 1899, 'SKU-032', 22, 'cat-007', 'art-002'],
      ['prod-033', 'golden-necklace', JSON.stringify({en: 'Golden Necklace', hi: 'गोल्डन नेकलेस'}), JSON.stringify({en: 'Exquisite gold-plated necklace for women', hi: 'महिलाओं के लिए शानदार सोने की प्लेटेड हार'}), 2799, 3799, 'SKU-033', 12, 'cat-007', 'art-001'],
      ['prod-034', 'golden-bracelet', JSON.stringify({en: 'Golden Bracelet', hi: 'गोल्डन ब्रेसलेट'}), JSON.stringify({en: 'Elegant gold-plated bracelet for women', hi: 'महिलाओं के लिए सुरुचिपूर्ण सोने की प्लेटेड कंघाई'}), 1999, 2699, 'SKU-034', 16, 'cat-007', 'art-003'],
      ['prod-035', 'golden-earrings', JSON.stringify({en: 'Golden Earrings', hi: 'गोल्डन इयररिंग्स'}), JSON.stringify({en: 'Stylish gold-plated earrings for women', hi: 'महिलाओं के लिए फैशनेबल सोने की प्लेटेड कान के आभूषण'}), 1499, 2099, 'SKU-035', 20, 'cat-007', 'art-004'],
      ['prod-036', 'bridal-set', JSON.stringify({en: 'Bridal Set', hi: 'ब्राइडल सेट'}), JSON.stringify({en: 'Complete bridal jewelry set', hi: 'पूर्ण ब्राइडल आभूषण सेट'}), 8999, 12999, 'SKU-036', 5, 'cat-007', 'art-001'],
      ['prod-037', 'armlet', JSON.stringify({en: 'Armlet', hi: 'आर्मलेट'}), JSON.stringify({en: 'Traditional armlet for special occasions', hi: 'विशेष अवसरों के लिए पारंपरिक आर्मलेट'}), 2499, 3499, 'SKU-037', 8, 'cat-007', 'art-002'],
      ['prod-038', 'golden-glamour-wrist', JSON.stringify({en: 'Golden Glamour Wrist', hi: 'गोल्डन ग्लैमर रिस्ट'}), JSON.stringify({en: 'Luxury golden wrist accessory', hi: 'लक्ज़री गोल्डन रिस्ट एक्सेसरी'}), 2999, 4199, 'SKU-038', 7, 'cat-007', 'art-003'],
      ['prod-039', 'radiant-south-asian', JSON.stringify({en: 'Radiant South Asian', hi: 'रेडिएंट साउथ एशियन'}), JSON.stringify({en: 'Beautiful South Asian jewelry set', hi: 'सुंदर साउथ एशियन आभूषण सेट'}), 3499, 4899, 'SKU-039', 6, 'cat-007', 'art-004'],
      ['prod-040', 'luxury-bracelet-closeup', JSON.stringify({en: 'Luxury Bracelet Close-up', hi: 'लक्ज़री ब्रेसलेट क्लोज-अप'}), JSON.stringify({en: 'Premium luxury bracelet with detailed craftsmanship', hi: 'विस्तृत कारीगरी के साथ प्रीमियम लक्ज़री कंघाई'}), 3999, 5499, 'SKU-040', 4, 'cat-007', 'art-001']
    ];
    
    for (const product of products) {
      try {
        // Check if product already exists
        const [existing] = await connection.execute('SELECT id FROM products WHERE id = ?', [product[0]]);
        
        if (existing.length === 0) {
          const productQuery = `
            INSERT INTO products (id, slug, title, description, price, originalPrice, sku, stock, categoryId, artisanId, createdAt, updatedAt, featured, bestSeller, newArrival)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)
          `;
          
          // Randomly set featured, bestSeller, and newArrival flags
          const featured = Math.random() > 0.7 ? 1 : 0;
          const bestSeller = Math.random() > 0.8 ? 1 : 0;
          const newArrival = Math.random() > 0.8 ? 1 : 0;
          
          await connection.execute(productQuery, [...product, featured, bestSeller, newArrival]);
          
          // Create product image
          const imageQuery = `
            INSERT INTO product_images (id, productId, url, isPrimary, sortOrder, createdAt)
            VALUES (?, ?, ?, ?, ?, NOW())
          `;
          
          // Determine image URL based on product ID
          let imageUrl = '/images/products/placeholder.jpg';
          if (product[0].startsWith('prod-00')) {
            // Use specific images for first products
            switch (product[0]) {
              case 'prod-001':
                imageUrl = '/images/products/Gold_Necklace_Set_Ecom_Soni_s778.png';
                break;
              case 'prod-002':
                imageUrl = '/images/products/Gold_Royal_Earrings_E455.png';
                break;
              case 'prod-003':
                imageUrl = '/images/products/Gold_Bracelet_Geometric_Ecom_Soni.png';
                break;
              case 'prod-004':
                imageUrl = '/images/products/Men\'s_Gold_Diamond_Ring_r567.png';
                break;
              case 'prod-005':
                imageUrl = '/images/products/Gold_Anklet_Traditional_Soni_a677.png';
                break;
              case 'prod-006':
                imageUrl = '/images/products/Mangalsutra_Soni_Fashion_Ecommerce_a822.png';
                break;
              case 'prod-007':
                imageUrl = '/images/products/Gold_Hair_Chain_Product_Shot_hc567.png';
                break;
              case 'prod-008':
                imageUrl = '/images/products/Gold_Nose_Ring.png';
                break;
              case 'prod-009':
                imageUrl = '/images/products/Gold_Plated_Bracelet_Elegance_a397.png';
                break;
              case 'prod-010':
                imageUrl = '/images/products/Golden_Bangles_Radiant_Arm_Macro.png';
                break;
            }
          } else if (product[0].startsWith('prod-02')) {
            // Men's products
            switch (product[0]) {
              case 'prod-021':
                imageUrl = '/images/mens product/Soni_Gold_Chain_Watermark.png';
                break;
              case 'prod-022':
                imageUrl = '/images/mens product/Luxury_Gold_Watch_Marble_Macro.png';
                break;
              case 'prod-023':
                imageUrl = '/images/mens product/Gold_Pendant_Marble_Luxury_Macro.png';
                break;
              case 'prod-024':
                imageUrl = '/images/mens product/Gold_Bracelet_Marble_Macro_Luxury (2).png';
                break;
              case 'prod-025':
                imageUrl = '/images/mens product/Gold_Ring_Yellow_Stone_Men.png';
                break;
              case 'prod-026':
                imageUrl = '/images/mens product/Kada_Men_Ethnic_Gold_Plated.png';
                break;
              case 'prod-027':
                imageUrl = '/images/mens product/Kohli_Chain_Soni_Fashion_e274.png';
                break;
              case 'prod-028':
                imageUrl = '/images/mens product/Gold_Money_Clip_Luxury_Macro.png';
                break;
              case 'prod-029':
                imageUrl = '/images/mens product/Gold_Signet_Ring_Marble_Macro.png';
                break;
              case 'prod-030':
                imageUrl = '/images/mens product/Gold_Tie_Clip_Marble_Luxury.png';
                break;
            }
          } else if (product[0].startsWith('prod-03')) {
            // Women's products
            switch (product[0]) {
              case 'prod-031':
                imageUrl = '/images/women collection/Golden_Bangles_Radiant_Arm_Macro.png';
                break;
              case 'prod-032':
                imageUrl = '/images/women collection/Golden_Ring_South_Asian_Hand.png';
                break;
              case 'prod-033':
                imageUrl = '/images/women collection/Golden_Radiance_Portrait.png';
                break;
              case 'prod-034':
                imageUrl = '/images/women collection/South_Asian_Luxury_Bracelet_Close-up.png';
                break;
              case 'prod-035':
                imageUrl = '/images/women collection/Radiant_South_Asian_Elegance.png';
                break;
              case 'prod-036':
                imageUrl = '/images/products/Gold_Bridal_Set_Product_Shot.png';
                break;
              case 'prod-037':
                imageUrl = '/images/products/Armlet_Product_Photography_ar234.png';
                break;
              case 'prod-038':
                imageUrl = '/images/women collection/Golden_Glamour_Wrist.png';
                break;
              case 'prod-039':
                imageUrl = '/images/women collection/Radiant_South_Asian_Elegance.png';
                break;
              case 'prod-040':
                imageUrl = '/images/women collection/South_Asian_Luxury_Bracelet_Close-up.png';
                break;
            }
          }
          
          await connection.execute(imageQuery, [`img-${product[0].substring(5)}`, product[0], imageUrl, 1, 0]);
          
          console.log(`✅ Created product: ${JSON.parse(product[2]).en} (${product[0]})`);
        } else {
          console.log(`Product already exists: ${product[0]}`);
        }
      } catch (error) {
        console.log(`Error creating product ${product[0]}:`, error.message);
      }
    }
    
    // Update some products to be featured, new arrivals, and best sellers
    try {
      await connection.execute('UPDATE products SET featured = 1 WHERE id IN (?, ?, ?, ?)', ['prod-001', 'prod-002', 'prod-021', 'prod-031']);
      await connection.execute('UPDATE products SET newArrival = 1 WHERE id IN (?, ?, ?, ?, ?)', ['prod-001', 'prod-003', 'prod-005', 'prod-022', 'prod-033']);
      await connection.execute('UPDATE products SET bestSeller = 1 WHERE id IN (?, ?, ?, ?)', ['prod-002', 'prod-004', 'prod-023', 'prod-036']);
      console.log('✅ Updated product flags for featured, new arrivals, and best sellers');
    } catch (error) {
      console.log('Error updating product flags:', error.message);
    }
    
    await connection.end();
    console.log('✅ Database population completed successfully!');
    
  } catch (error) {
    console.error('❌ Database population failed:');
    console.error('Error message:', error.message);
    
    if (connection) {
      await connection.end().catch(() => {});
    }
  }
}

populateDatabase();