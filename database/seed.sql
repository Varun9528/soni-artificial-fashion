-- Pachmarhi Tribal Art Marketplace Seed Data
-- Generated on 2025-10-10T13:35:49.196Z

-- Clear existing data (in reverse order of dependencies)
DELETE FROM coupon_usage;
DELETE FROM coupons;
DELETE FROM banners;
DELETE FROM artisans;
DELETE FROM users;

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, password_hash, name, role, email_verified) VALUES 
('admin-001', 'admin@pachmarhi.com', '$2a$12$7GSGeL2e8w8rfcnN4fzGwueZ.HZ4M2ndWsO3yDvUIMkvWDT58QWQy', 'Admin User', 'super_admin', TRUE);

-- Insert artisans first
INSERT INTO artisans (id, name, bio_en, bio_hi, specialization, location, phone, email, avatar, experience_years, rating, is_verified) VALUES
('sarla-bai', 'Sarla Bai', 'Master artisan specializing in Gond art with over 20 years of experience. Sarla creates intricate patterns inspired by nature and tribal folklore.', 'गोंड कला में विशेषज्ञता रखने वाली मास्टर कारीगर, 20 से अधिक वर्षों का अनुभव। सरला प्रकृति और जनजातीय लोककथाओं से प्रेरित जटिल पैटर्न बनाती हैं।', 'Gond Art, Traditional Paintings', 'Pachmarhi, Madhya Pradesh', '+91 9876543210', 'sarla@pachmarhi.com', '/images/artisans/arti-sarla-bai.jpg', 20, 4.8, TRUE),
('meera-gond', 'Meera Gond', 'Skilled weaver and textile artist known for creating beautiful handloom fabrics using traditional techniques passed down through generations.', 'कुशल बुनकर और वस्त्र कलाकार जो पीढ़ियों से चली आ रही पारंपरिक तकनीकों का उपयोग करके सुंदर हैंडलूम कपड़े बनाने के लिए जानी जाती हैं।', 'Handloom Weaving, Textiles', 'Pachmarhi, Madhya Pradesh', '+91 9876543211', 'meera@pachmarhi.com', '/images/artisans/arti-meera-gond.jpg', 15, 4.7, TRUE),
('ramesh-uikey', 'Ramesh Uikey', 'Expert craftsman specializing in Dokra metal work and terracotta pottery. His pieces reflect the rich cultural heritage of tribal art.', 'डोकरा धातु कार्य और टेराकोटा मिट्टी के बर्तन में विशेषज्ञता रखने वाले विशेषज्ञ शिल्पकार। उनके टुकड़े जनजातीय कला की समृद्ध सांस्कृतिक विरासत को दर्शाते हैं।', 'Dokra Art, Terracotta', 'Pachmarhi, Madhya Pradesh', '+91 9876543212', 'ramesh@pachmarhi.com', '/images/artisans/arti-ramesh-uikey.jpg', 18, 4.9, TRUE);

-- Insert banners
INSERT INTO banners (title_en, title_hi, subtitle_en, subtitle_hi, description_en, description_hi, image_desktop, link_url, link_text_en, link_text_hi, display_order, is_active) VALUES
('Authentic Tribal Art', 'प्रामाणिक जनजातीय कला', 'Discover the Beauty of Pachmarhi', 'पचमढ़ी की सुंदरता खोजें', 'Handcrafted with love by tribal artisans', 'जनजातीय कारीगरों द्वारा प्रेम से हस्तनिर्मित', '/images/hero/hero1.jpg', '/category/home-decor', 'Shop Now', 'अभी खरीदें', 1, TRUE),
('Handloom Textiles', 'हैंडलूम वस्त्र', 'Traditional Weaving Excellence', 'पारंपरिक बुनाई उत्कृष्टता', 'Premium quality handwoven fabrics', 'प्रीमियम गुणवत्ता हाथ से बुने कपड़े', '/images/hero/hero2.jpg', '/category/handloom-textiles', 'Explore', 'खोजें', 2, TRUE),
('Festive Collection', 'त्योहारी संग्रह', 'Special Occasion Pieces', 'विशेष अवसर के टुकड़े', 'Perfect for celebrations and gifts', 'उत्सव और उपहार के लिए आदर्श', '/images/hero/hero3.jpg', '/category/jewelry', 'Shop Collection', 'संग्रह खरीदें', 3, TRUE);

-- Insert coupons
INSERT INTO coupons (code, title, description, type, value, minimum_order_amount, maximum_discount_amount, usage_limit, user_usage_limit, valid_from, valid_until, is_active) VALUES
('WELCOME10', 'Welcome Offer', '10% off on first order', 'percentage', 10, 500, 200, 1000, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE),
('FREESHIP', 'Free Shipping', 'Free shipping on orders above ₹299', 'free_shipping', 0, 299, NULL, NULL, 5, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE),
('TRIBAL50', 'Tribal Art Special', '₹50 off on tribal art items', 'fixed', 50, 1000, NULL, 500, 2, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE);