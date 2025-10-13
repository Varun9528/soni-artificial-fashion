const mysql = require('mysql2');

// Create connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pachmarhi'
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Get category IDs
let homeDecorCategoryId, jewelryCategoryId, clothingCategoryId, accessoriesCategoryId;
let artisanId;

connection.query('SELECT id FROM categories WHERE id = ?', ['home-decor'], (err, results) => {
  if (err) {
    console.error('Error getting home decor category:', err);
    return;
  }
  if (results.length > 0) {
    homeDecorCategoryId = results[0].id;
  }
  
  connection.query('SELECT id FROM categories WHERE id = ?', ['jewelry'], (err, results) => {
    if (err) {
      console.error('Error getting jewelry category:', err);
      return;
    }
    if (results.length > 0) {
      jewelryCategoryId = results[0].id;
    }
    
    connection.query('SELECT id FROM categories WHERE id = ?', ['handloom-textiles'], (err, results) => {
      if (err) {
        console.error('Error getting clothing category:', err);
        return;
      }
      if (results.length > 0) {
        clothingCategoryId = results[0].id;
      }
      
      connection.query('SELECT id FROM categories WHERE id = ?', ['accessories'], (err, results) => {
        if (err) {
          console.error('Error getting accessories category:', err);
          return;
        }
        if (results.length > 0) {
          accessoriesCategoryId = results[0].id;
        }
        
        connection.query('SELECT id FROM artisans LIMIT 1', (err, results) => {
          if (err) {
            console.error('Error getting artisan:', err);
            return;
          }
          if (results.length > 0) {
            artisanId = results[0].id;
            console.log('Using artisan ID:', artisanId);
            
            // Insert sample products
            const sampleProducts = [
              // Home Decor products
              ['Handwoven Basket', 'हाथ से बुनी टोकरी', 'handwoven-basket', 'Beautiful handwoven basket made from natural materials', 'प्राकृतिक सामग्री से बनी सुंदर हाथ से बुनी टोकरी', 799, 20, 'HWB001', homeDecorCategoryId, 1, 0, 1, 1, 4.6, 15, 98, 12],
              ['Tribal Wall Hanging', 'जनजातीय दीवार का सजावट', 'tribal-wall-hanging', 'Colorful tribal wall hanging with traditional patterns', 'पारंपरिक पैटर्न वाली रंगीन जनजातीय दीवार का सजावट', 1499, 12, 'TWH001', homeDecorCategoryId, 0, 1, 0, 1, 4.8, 22, 156, 18],
              ['Wooden Carving Set', 'लकड़ी की नक्काशी सेट', 'wooden-carving-set', 'Set of 3 wooden carvings with intricate designs', 'जटिल डिजाइन वाली 3 लकड़ी की नक्काशी की सेट', 2299, 8, 'WCS001', homeDecorCategoryId, 1, 1, 0, 0, 4.9, 18, 203, 15],
              ['Clay Pottery Set', 'मिट्टी के बर्तनों का सेट', 'clay-pottery-set', 'Set of 5 hand-painted clay pots', '5 हाथ से पेंट किए गए मिट्टी के बर्तनों का सेट', 1199, 15, 'CPS001', homeDecorCategoryId, 0, 0, 1, 0, 4.4, 9, 76, 6],
              ['Bamboo Lamp', 'बांस का लैम्प', 'bamboo-lamp', 'Handcrafted bamboo lamp with warm lighting', 'गर्म प्रकाश वाला हाथ से बना बांस का लैम्प', 1599, 10, 'BL001', homeDecorCategoryId, 1, 0, 1, 1, 4.7, 14, 134, 11],
              
              // Jewelry products
              ['Tribal Brass Earrings', 'जनजातीय पीतल के कान के आभूषण', 'tribal-brass-earrings', 'Pair of traditional brass earrings with tribal motifs', 'जनजातीय प्रेरणा वाले पारंपरिक पीतल के कान के आभूषण की जोड़ी', 599, 25, 'TBE001', jewelryCategoryId, 0, 1, 0, 1, 4.5, 20, 167, 17],
              ['Handcrafted Anklet', 'हाथ से बना पांव का आभूषण', 'handcrafted-anklet', 'Beautiful silver anklet with traditional design', 'पारंपरिक डिजाइन वाला सुंदर चांदी का पांव का आभूषण', 799, 18, 'HA001', jewelryCategoryId, 1, 0, 1, 0, 4.6, 12, 89, 9],
              ['Tribal Necklace Set', 'जनजातीय हार का सेट', 'tribal-necklace-set', 'Set of 3 necklaces with different tribal patterns', 'अलग-अलग जनजातीय पैटर्न वाले 3 हारों का सेट', 1299, 12, 'TNS001', jewelryCategoryId, 1, 1, 0, 1, 4.8, 25, 198, 22],
              
              // Clothing products
              ['Tribal Printed Shirt', 'जनजातीय छपाई वाली शर्ट', 'tribal-printed-shirt', 'Cotton shirt with traditional tribal prints', 'पारंपरिक जनजातीय छपाई वाली सूती शर्ट', 899, 30, 'TPS001', clothingCategoryId, 0, 1, 1, 0, 4.3, 16, 145, 13],
              ['Handwoven Scarf', 'हाथ से बुना स्कार्फ', 'handwoven-scarf', 'Colorful handwoven scarf made from natural fibers', 'प्राकृतिक फाइबर से बना रंगीन हाथ से बुना स्कार्फ', 699, 22, 'HWS001', clothingCategoryId, 1, 0, 1, 1, 4.5, 11, 92, 8],
              
              // Accessories products
              ['Tribal Cushion Cover', 'जनजातीय कुशन कवर', 'tribal-cushion-cover', 'Cotton cushion cover with tribal embroidery', 'जनजातीय बुनाई वाला सूती कुशन कवर', 499, 28, 'TCC001', accessoriesCategoryId, 0, 1, 0, 1, 4.4, 13, 112, 10],
              ['Wooden Keychain', 'लकड़ी की चाबी की जंजीर', 'wooden-keychain', 'Handcrafted wooden keychain with tribal design', 'जनजातीय डिजाइन वाली हाथ से बनी लकड़ी की चाबी की जंजीर', 199, 50, 'WK001', accessoriesCategoryId, 1, 0, 1, 0, 4.2, 8, 67, 5]
            ];

            // Insert sample products sequentially
            let index = 0;
            
            function insertNextProduct() {
              if (index >= sampleProducts.length) {
                console.log('All products inserted');
                return;
              }
              
              const product = sampleProducts[index];
              // Generate a unique ID for the product
              const productId = 'prod-' + Date.now() + '-' + index + '-' + Math.floor(Math.random() * 1000);
              console.log('Inserting product:', index, product[0], 'with ID:', productId);
              const query = `INSERT IGNORE INTO products (id, title_en, title_hi, slug, description_en, description_hi, price, stock, sku, category_id, artisan_id, featured, best_seller, new_arrival, trending, rating, review_count, view_count, sales_count, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`;
              const values = [productId, product[0], product[1], product[2], product[3], product[4], product[5], product[6], product[7], product[8], artisanId, product[9], product[10], product[11], product[12], product[13], product[14], product[15], product[16]];
              
              connection.query(query, values, (err, results) => {
                if (err) {
                  console.error('Error inserting product:', product[0], err);
                } else {
                  console.log('Inserted product:', product[0]);
                }
                
                index++;
                setTimeout(insertNextProduct, 100); // Small delay to ensure sequential execution
              });
            }
            
            insertNextProduct();
          }
        });
      });
    });
  });
});

setTimeout(() => {
  console.log('Product seeding completed!');
  connection.end();
}, 5000);