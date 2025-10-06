-- Seed data for Pachmarhi Tribal Art Marketplace

-- Clear existing data
DELETE FROM coupon_usage;
DELETE FROM coupons;
DELETE FROM banners;
DELETE FROM product_reviews;
DELETE FROM returns;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM wishlists;
DELETE FROM carts;
DELETE FROM product_variants;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM artisans;
DELETE FROM categories;
DELETE FROM user_addresses;
DELETE FROM refresh_tokens;
DELETE FROM users WHERE email = 'user@pachmarhi.com'; -- Only delete demo user, keep admin

-- Hashed passwords for admin123 and user123
-- These are bcrypt hashed values
SET @user_password = '$2a$12$wHjp1RYkQHyPuME.lmF0XuVwD3b/pX47ROfL4sOhW5IHbIL3PKdqy'; -- user123

-- Create Demo User (admin already exists)
INSERT INTO users (id, email, password_hash, name, role, email_verified) VALUES 
('user-001', 'user@pachmarhi.com', @user_password, 'Demo User', 'customer', TRUE);

-- Create Categories
INSERT INTO categories (id, name_en, name_hi, description_en, description_hi, image, display_order) VALUES 
('tribal-shirts', 'Tribal Shirts', 'जनजातीय शर्ट', 'Traditional tribal printed shirts and ethnic wear', 'पारंपरिक जनजातीय मुद्रित शर्ट और जातीय पहनावा', '/images/categories/cat-tribal-shirts.jpg', 1),
('jewelry', 'Jewelry', 'आभूषण', 'Handcrafted tribal jewelry and accessories', 'हस्तनिर्मित जनजातीय आभूषण और सहायक उपकरण', '/images/categories/cat-jewelry.jpg', 2),
('handloom-textiles', 'Handloom Textiles', 'हैंडलूम वस्त्र', 'Traditional handwoven textiles and fabrics', 'पारंपरिक हस्तबुने वस्त्र और कपड़े', '/images/categories/cat-handloom-textiles.jpg', 3),
('home-decor', 'Home Decor', 'घर की सजावट', 'Beautiful home decor items and tribal art', 'सुंदर घर की सजावट की वस्तुएं और जनजातीय कला', '/images/categories/cat-home-decor.jpg', 4),
('accessories', 'Accessories', 'सहायक उपकरण', 'Tribal accessories and decorative items', 'जनजातीय सहायक उपकरण और सजावटी वस्तुएं', '/images/categories/cat-accessories.jpg', 5),
('gifts-souvenirs', 'Gifts & Souvenirs', 'उपहार और स्मृति चिन्ह', 'Perfect gifts and memorable souvenirs', 'पूर्ण उपहार और यादगार स्मृति चिन्ह', '/images/categories/cat-gifts-souvenirs.jpg', 6);

-- Create Artisans
INSERT INTO artisans (id, user_id, name, bio_en, bio_hi, specialization, location, phone, email, avatar, portfolio_images, social_links, experience_years, rating, total_products, is_verified, is_active, created_at, updated_at) VALUES 
('sarla-bai', NULL, 'Sarla Bai', 'Master weaver from Pachmarhi with 25 years of experience in traditional handloom techniques.', 'पचमढ़ी की मास्टर बुनकर जिनके पास पारंपरिक हैंडलूम तकनीकों में 25 साल का अनुभव है।', NULL, 'Pachmarhi', NULL, NULL, '/images/artisans/arti-sarla.jpg', '["Handloom Weaving", "Traditional Textiles"]', NULL, 25, 4.8, 15, TRUE, TRUE, NOW(), NOW()),
('ramesh-uikey', NULL, 'Ramesh Uikey', 'Skilled pottery artisan specializing in terracotta crafts.', 'टेराकोटा शिल्प में विशेषज्ञता रखने वाले कुशल मिट्टी के बर्तन कारीगर।', NULL, 'Bori', NULL, NULL, '/images/artisans/arti-ramesh.jpg', '["Pottery", "Terracotta", "Ceramics"]', NULL, 18, 4.6, 12, TRUE, TRUE, NOW(), NOW()),
('meera-gond', NULL, 'Meera Gond', 'Renowned Gond painting artist preserving ancient tribal art forms.', 'प्राचीन जनजातीय कला रूपों को संरक्षित करने वाली प्रसिद्ध गोंड चित्रकारी कलाकार।', NULL, 'Satpura', NULL, NULL, '/images/artisans/arti-meera.jpg', '["Gond Painting", "Traditional Art", "Wall Art"]', NULL, 22, 4.9, 20, TRUE, TRUE, NOW(), NOW()),
('raj-kumar', NULL, 'Raj Kumar', 'Expert bamboo and cane craftsman creating sustainable products.', 'बांस और बेंत के विशेषज्ञ कारीगर जो टिकाऊ उत्पाद बनाते हैं।', NULL, 'Pachmarhi', NULL, NULL, '/images/artisans/arti-raj.jpg', '["Bamboo Craft", "Cane Work", "Eco Products"]', NULL, 20, 4.7, 18, TRUE, TRUE, NOW(), NOW());

-- Create Products
INSERT INTO products (slug, title_en, title_hi, description_en, description_hi, price, original_price, discount_percentage, sku, stock, material, tags, featured, best_seller, trending, new_arrival, rating, review_count, view_count, sales_count, category_id, artisan_id) VALUES 
('bamboo-wall-art', 'Bamboo Wall Art', 'बांस की दीवार कला', 'Beautiful handcrafted bamboo wall art featuring traditional tribal motifs.', 'पारंपरिक जनजातीय रूपांकनों को दर्शाने वाली सुंदर हस्तनिर्मित बांस की दीवार कला।', 1699.00, 1899.00, 10, 'BWA-001', 12, '["Bamboo"]', '["wall art", "bamboo", "eco-friendly", "tribal", "home decor"]', TRUE, TRUE, FALSE, FALSE, 4.5, 24, 0, 0, 'home-decor', 'raj-kumar'),
('handloom-sari', 'Handloom Sari', 'हैंडलूम साड़ी', 'Exquisite handwoven sari featuring traditional tribal patterns.', 'पारंपरिक जनजातीय पैटर्न को दर्शाने वाली उत्कृष्ट हस्तबुनी साड़ी।', 2999.00, 3499.00, 15, 'HLS-001', 8, '["Cotton"]', '["sari", "handloom", "cotton", "traditional", "ethnic wear"]', TRUE, TRUE, FALSE, FALSE, 4.8, 36, 0, 0, 'handloom-textiles', 'sarla-bai'),
('tribal-silver-earrings', 'Tribal Silver Earrings', 'जनजातीय चांदी के कान के झूले', 'Handcrafted silver earrings with traditional tribal designs.', 'पारंपरिक जनजातीय डिज़ाइनों के साथ हस्तनिर्मित चांदी के कान के झूले।', 899.00, 999.00, 10, 'TSE-001', 25, '["Silver"]', '["earrings", "silver", "tribal", "jewelry", "accessories"]', TRUE, FALSE, TRUE, FALSE, 4.6, 18, 0, 0, 'jewelry', 'ramesh-uikey'),
('gond-painting', 'Gond Painting', 'गोंड चित्रकारी', 'Authentic Gond painting depicting tribal life and nature.', 'जनजातीय जीवन और प्रकृति को चित्रित करने वाली प्रामाणिक गोंड चित्रकारी।', 3499.00, 3999.00, 10, 'GP-001', 5, '["Canvas", "Acrylic Paint"]', '["painting", "gond", "tribal", "art", "wall decor"]', TRUE, FALSE, FALSE, TRUE, 4.9, 15, 0, 0, 'art-paintings', 'meera-gond'),
('tribal-printed-shirt', 'Tribal Printed Shirt', 'जनजातीय मुद्रित शर्ट', 'Comfortable cotton shirt with authentic tribal prints.', 'प्रामाणिक जनजातीय प्रिंट के साथ आरामदायक कपास की शर्ट।', 1299.00, 1499.00, 10, 'TPS-001', 20, '["Cotton"]', '["shirt", "tribal", "cotton", "clothing", "ethnic wear"]', FALSE, FALSE, TRUE, FALSE, 4.4, 32, 0, 0, 'tribal-shirts', 'sarla-bai');

-- Create Banners
INSERT INTO banners (title_en, title_hi, subtitle_en, subtitle_hi, image_desktop, link_url, type, is_active, display_order) VALUES 
('Handmade Bamboo Crafts', 'हस्तनिर्मित बाँस शिल्प', 'Sustainable & Beautiful', 'टिकाऊ और सुंदर', '/images/hero/hero1.jpg', '/category/home-decor', 'HERO', TRUE, 1),
('Traditional Textiles', 'पारंपरिक वस्त्र', 'Handwoven with Love', 'प्यार से हाथ से बुने', '/images/hero/hero2.jpg', '/category/handloom-textiles', 'HERO', TRUE, 2),
('Tribal Jewelry Collection', 'जनजातीय आभूषण संग्रह', 'Authentic & Unique', 'प्रामाणिक और अद्वितीय', '/images/hero/hero3.jpg', '/category/jewelry', 'HERO', TRUE, 3);

-- Create Coupons
SET @now = NOW();
INSERT INTO coupons (code, title, description, type, value, minimum_order_amount, maximum_discount_amount, usage_limit, usage_count, user_usage_limit, valid_from, valid_until, applicable_categories, applicable_products, is_active) VALUES 
('WELCOME10', 'Welcome Discount', '10% off on your first order', 'percentage', 10.00, 500.00, 500.00, 100, 0, 1, @now, DATE_ADD(@now, INTERVAL 30 DAY), NULL, NULL, TRUE),
('FESTIVE50', 'Festival Offer', '₹50 off on orders above ₹1000', 'fixed', 50.00, 1000.00, NULL, 200, 0, 1, @now, DATE_ADD(@now, INTERVAL 15 DAY), NULL, NULL, TRUE),
('FREESHIP', 'Free Shipping', 'Free shipping on orders above ₹999', 'free_shipping', 0.00, 999.00, NULL, 500, 0, 1, @now, DATE_ADD(@now, INTERVAL 60 DAY), NULL, NULL, TRUE);