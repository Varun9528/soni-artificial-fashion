-- Simplified Pachmarhi Tribal Art Marketplace Database Schema for MySQL

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    image VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Artisans
CREATE TABLE artisans (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    bio_en TEXT,
    bio_hi TEXT,
    specialization VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar VARCHAR(500),
    experience_years INT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    sku VARCHAR(100),
    stock INT DEFAULT 0,
    material VARCHAR(255),
    category_id VARCHAR(50) NOT NULL,
    artisan_id VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    tags TEXT,
    featured BOOLEAN DEFAULT FALSE,
    best_seller BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product images
CREATE TABLE product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36),
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(20) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Carts
CREATE TABLE carts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Wishlists
CREATE TABLE wishlists (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Banners
CREATE TABLE banners (
    id VARCHAR(36) PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    subtitle_en VARCHAR(255),
    subtitle_hi VARCHAR(255),
    image_desktop VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Coupons
CREATE TABLE coupons (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATETIME NOT NULL,
    valid_until DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, password_hash, name, role, email_verified) VALUES 
('admin-001', 'admin@pachmarhi.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeD2WBLBfp3cQ3T/a', 'Admin User', 'super_admin', TRUE);

-- Insert default categories
INSERT INTO categories (id, name_en, name_hi, description_en, description_hi, image, display_order) VALUES 
('home-decor', 'Home Decor', 'घर की सजावट', 'Beautiful handcrafted items for home decoration', 'घर की सजावट के लिए सुंदर हस्तनिर्मित वस्तुएं', '/images/categories/cat-home-decor.jpg', 1),
('handloom-textiles', 'Handloom Textiles', 'हैंडलूम वस्त्र', 'Traditional handwoven fabrics and clothing', 'पारंपरिक हाथ से बुने हुए कपड़े और वस्त्र', '/images/categories/cat-handloom-textiles.jpg', 2),
('jewelry', 'Jewelry', 'आभूषण', 'Handcrafted traditional jewelry pieces', 'हस्तनिर्मित पारंपरिक आभूषण', '/images/categories/cat-jewelry.jpg', 3),
('tribal-shirts', 'Tribal Shirts', 'जनजातीय शर्ट', 'Shirts with authentic tribal prints and patterns', 'प्रामाणिक जनजातीय प्रिंट और पैटर्न वाली शर्ट', '/images/categories/cat-tribal-shirts.jpg', 4),
('accessories', 'Accessories', 'सहायक उपकरण', 'Traditional accessories and utility items', 'पारंपरिक सहायक उपकरण और उपयोगी वस्तुएं', '/images/categories/cat-accessories.jpg', 5),
('art-paintings', 'Art & Paintings', 'कला और चित्रकारी', 'Traditional art forms and paintings', 'पारंपरिक कला रूप और चित्रकारी', '/images/categories/cat-art-paintings.jpg', 6);