-- Pachmarhi Tribal Art Marketplace Database Schema for PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with role-based access control
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    account_locked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Refresh tokens for JWT authentication
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Categories
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    image VARCHAR(500),
    parent_id VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Artisans
CREATE TABLE artisans (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    bio_en TEXT,
    bio_hi TEXT,
    specialization VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar VARCHAR(500),
    portfolio_images JSONB,
    social_links JSONB,
    experience_years INT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_products INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_artisans_user_id ON artisans(user_id);
CREATE INDEX idx_artisans_is_active ON artisans(is_active);
CREATE INDEX idx_artisans_rating ON artisans(rating);

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
    discount_percentage INT DEFAULT 0,
    sku VARCHAR(100),
    stock INT DEFAULT 0,
    min_stock_level INT DEFAULT 5,
    weight DECIMAL(8,2),
    dimensions VARCHAR(255),
    material VARCHAR(255),
    color VARCHAR(100),
    category_id VARCHAR(50) NOT NULL,
    artisan_id VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    tags JSONB,
    featured BOOLEAN DEFAULT FALSE,
    best_seller BOOLEAN DEFAULT FALSE,
    trending BOOLEAN DEFAULT FALSE,
    new_arrival BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (artisan_id) REFERENCES artisans(id)
);

-- Create indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_artisan_id ON products(artisan_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Product images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(display_order);

-- Product variants (sizes, colors, etc.)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) NOT NULL,
    variant_type VARCHAR(50) NOT NULL, -- 'size', 'color', etc.
    variant_value VARCHAR(100) NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    sku VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_variant_type ON product_variants(variant_type);

-- User addresses
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    address_type VARCHAR(10) DEFAULT 'home',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(20) NOT NULL,
    payment_id VARCHAR(255),
    transaction_id VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    estimated_delivery DATE,
    delivered_at TIMESTAMP,
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    variant_id UUID,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- Create indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Carts (for logged-in users)
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    variant_id UUID,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- Create unique constraint and indexes
CREATE UNIQUE INDEX idx_carts_unique_item ON carts(user_id, product_id, variant_id);
CREATE INDEX idx_carts_user_id ON carts(user_id);

-- Wishlists
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create unique constraint and indexes
CREATE UNIQUE INDEX idx_wishlists_unique_item ON wishlists(user_id, product_id);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);

-- Product reviews
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) NOT NULL,
    user_id UUID,
    order_id UUID,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images JSONB,
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_product_reviews_is_approved ON product_reviews(is_approved);

-- Returns and refunds
CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    order_item_id UUID NOT NULL,
    user_id UUID NOT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    images JSONB,
    status VARCHAR(20) DEFAULT 'requested',
    refund_amount DECIMAL(10,2),
    refund_method VARCHAR(20) DEFAULT 'original',
    admin_notes TEXT,
    collected_at TIMESTAMP,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (order_item_id) REFERENCES order_items(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes
CREATE INDEX idx_returns_order_id ON returns(order_id);
CREATE INDEX idx_returns_user_id ON returns(user_id);
CREATE INDEX idx_returns_status ON returns(status);

-- Coupons
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INT,
    usage_count INT DEFAULT 0,
    user_usage_limit INT DEFAULT 1,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    applicable_categories JSONB,
    applicable_products JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_valid_from ON coupons(valid_from);
CREATE INDEX idx_coupons_valid_until ON coupons(valid_until);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);

-- Coupon usage tracking
CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL,
    user_id UUID,
    order_id UUID NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Create indexes
CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);

-- Banners for homepage carousel
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    subtitle_en VARCHAR(255),
    subtitle_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    image_desktop VARCHAR(500) NOT NULL,
    image_mobile VARCHAR(500),
    link_url VARCHAR(500),
    link_text_en VARCHAR(100),
    link_text_hi VARCHAR(100),
    background_color VARCHAR(7) DEFAULT '#ffffff',
    text_color VARCHAR(7) DEFAULT '#000000',
    button_color VARCHAR(7) DEFAULT '#f59e0b',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_banners_display_order ON banners(display_order);
CREATE INDEX idx_banners_is_active ON banners(is_active);
CREATE INDEX idx_banners_start_date ON banners(start_date);
CREATE INDEX idx_banners_end_date ON banners(end_date);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP,
    action_url VARCHAR(500),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Notification templates
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    variables JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_notification_templates_name ON notification_templates(name);
CREATE INDEX idx_notification_templates_type ON notification_templates(type);
CREATE INDEX idx_notification_templates_is_active ON notification_templates(is_active);

-- Audit logs for admin actions
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- SEO and metadata
CREATE TABLE seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_type VARCHAR(100) NOT NULL, -- 'product', 'category', 'artisan', 'page'
    resource_id VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    description TEXT,
    keywords TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    og_image VARCHAR(500),
    canonical_url VARCHAR(500),
    robots VARCHAR(100) DEFAULT 'index,follow',
    structured_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint and indexes
CREATE UNIQUE INDEX idx_seo_metadata_unique_resource ON seo_metadata(page_type, resource_id);
CREATE INDEX idx_seo_metadata_page_type ON seo_metadata(page_type);

-- Site settings and configuration
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value_text TEXT,
    value_number DECIMAL(15,2),
    value_boolean BOOLEAN,
    value_json JSONB,
    description TEXT,
    category VARCHAR(100) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_site_settings_key_name ON site_settings(key_name);
CREATE INDEX idx_site_settings_category ON site_settings(category);
CREATE INDEX idx_site_settings_is_public ON site_settings(is_public);

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

-- Insert default site settings
INSERT INTO site_settings (key_name, value_text, description, category, is_public) VALUES 
('site_name', 'Pachmarhi Tribal Art Marketplace', 'Site name', 'general', TRUE),
('site_description', 'Authentic tribal art and handicrafts from Pachmarhi', 'Site description', 'general', TRUE),
('contact_email', 'contact@pachmarhi.com', 'Contact email', 'contact', TRUE),
('contact_phone', '+91 9876543210', 'Contact phone', 'contact', TRUE),
('shipping_free_threshold', '500', 'Free shipping threshold amount', 'shipping', TRUE),
('currency', 'INR', 'Site currency', 'general', TRUE),
('tax_rate', '18', 'Tax rate percentage', 'financial', FALSE);