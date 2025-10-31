// Server-side database operations using mysql2
// This file should only be imported in server-side code
import mysql from 'mysql2/promise';

// Log all environment variables for debugging
console.log('All env vars:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? '****' : 'NOT SET',
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});

// Database configuration from environment variables
// Ensure environment variables are loaded properly
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soni_artificial_fashion',
  port: parseInt(process.env.DB_PORT || '3306'),
  // Connection pool configuration to prevent "too many connections" error
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  keepAliveInitialDelay: 0,
  enableKeepAlive: true
};

// Log database configuration for debugging (without password)
console.log('Database config:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Create a connection pool with better configuration
const pool = mysql.createPool(dbConfig);

// Server-side database operations
export const serverDb = {
  // User operations
  async findUserByEmail(email: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      const user = (rows as any[])[0];
      return user || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async findUserById(id: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      const user = (rows as any[])[0];
      return user || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async createUser(userData: any): Promise<any | null> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash, phone, role, email_verified, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userData.name,
          userData.email,
          userData.password_hash,
          userData.phone || null,
          userData.role || 'customer',
          userData.email_verified || false
        ]
      );
      
      const userId = (result as any).insertId;
      
      // Fetch the created user
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      
      return (rows as any[])[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async updateUser(id: string, userData: any): Promise<any | null> {
    try {
      const [result] = await pool.execute(
        `UPDATE users SET name = ?, email = ?, phone = ?, role = ?, email_verified = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          userData.name,
          userData.email,
          userData.phone || null,
          userData.role,
          userData.email_verified || false,
          id
        ]
      );
      
      if ((result as any).affectedRows > 0) {
        // Fetch the updated user
        const [rows] = await pool.execute(
          'SELECT * FROM users WHERE id = ?',
          [id]
        );
        
        return (rows as any[])[0] || null;
      }
      
      return null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  // Product operations
  async getProductBySlug(slug: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
         c.id as category_id, a.name as artisan_name, a.id as artisan_id
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN artisans a ON p.artisan_id = a.id
         WHERE p.slug = ?`,
        [slug]
      );
      
      const product = (rows as any[])[0];
      if (!product) return null;
      
      // Get product images
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
        [product.id]
      );
      
      return {
        id: product.id,
        slug: product.slug,
        title: { en: product.title_en, hi: product.title_hi },
        description: { en: product.description_en, hi: product.description_hi },
        price: product.price,
        originalPrice: product.original_price,
        stock: product.stock,
        rating: product.rating,
        reviewCount: product.review_count,
        categoryId: product.category_id,
        artisanId: product.artisan_id,
        featured: product.featured,
        bestSeller: product.best_seller,
        newArrival: product.new_arrival,
        trending: product.trending,
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        category: product.category_id ? {
          id: product.category_id,
          name: { en: product.category_name_en, hi: product.category_name_hi }
        } : null,
        artisan: product.artisan_id ? {
          id: product.artisan_id,
          name: product.artisan_name
        } : null,
        productImages: (images as any[]).map(img => ({
          id: img.id,
          url: img.image_url,
          isPrimary: img.is_primary,
          displayOrder: img.display_order
        }))
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async getProducts(filters: any): Promise<any[]> {
    try {
      let query = `
        SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
        c.id as category_id, a.name as artisan_name, a.id as artisan_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN artisans a ON p.artisan_id = a.id
        WHERE p.is_active = 1
      `;
      
      const params: any[] = [];
      
      // Apply filters
      if (filters.category) {
        query += ' AND p.category_id = ?';
        params.push(filters.category);
      }
      
      if (filters.featured === true) {
        query += ' AND p.featured = 1';
      }
      
      if (filters.bestSeller === true) {
        query += ' AND p.best_seller = 1';
      }
      
      if (filters.newArrival === true) {
        query += ' AND p.new_arrival = 1';
      }
      
      query += ' ORDER BY p.created_at DESC';
      
      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
      }
      
      const [rows] = await pool.execute(query, params);
      
      // Enhance products with images
      const products = await Promise.all((rows as any[]).map(async (product) => {
        // Get product images
        const [images] = await pool.execute(
          'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
          [product.id]
        );
        
        return {
          id: product.id,
          slug: product.slug,
          title: { en: product.title_en, hi: product.title_hi },
          description: { en: product.description_en, hi: product.description_hi },
          price: product.price,
          originalPrice: product.original_price,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.review_count,
          categoryId: product.category_id,
          artisanId: product.artisan_id,
          featured: product.featured,
          bestSeller: product.best_seller,
          newArrival: product.new_arrival,
          trending: product.trending,
          isActive: product.is_active,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
          category: product.category_id ? {
            id: product.category_id,
            name: { en: product.category_name_en, hi: product.category_name_hi }
          } : null,
          artisan: product.artisan_id ? {
            id: product.artisan_id,
            name: product.artisan_name
          } : null,
          productImages: (images as any[]).map(img => ({
            id: img.id,
            url: img.image_url,
            isPrimary: img.is_primary,
            displayOrder: img.display_order
          }))
        };
      }));
      
      return products;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async searchProducts(searchParams: any): Promise<any> {
    try {
      let query = `
        SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
        c.id as category_id, a.name as artisan_name, a.id as artisan_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN artisans a ON p.artisan_id = a.id
        WHERE p.is_active = 1
      `;
      
      const params: any[] = [];
      const page = parseInt(searchParams.page) || 1;
      const limit = parseInt(searchParams.limit) || 12;
      const offset = (page - 1) * limit;
      
      // Apply search filters
      if (searchParams.category) {
        query += ' AND p.category_id = ?';
        params.push(searchParams.category);
      }
      
      if (searchParams.featured === true || searchParams.featured === 'true') {
        query += ' AND p.featured = 1';
      }
      
      if (searchParams.bestSeller === true || searchParams.bestSeller === 'true') {
        query += ' AND p.best_seller = 1';
      }
      
      if (searchParams.newArrival === true || searchParams.newArrival === 'true') {
        query += ' AND p.new_arrival = 1';
      }
      
      if (searchParams.trending === true || searchParams.trending === 'true') {
        query += ' AND p.trending = 1';
      }
      
      // Add search term filter if provided
      if (searchParams.search) {
        query += ' AND (p.title_en LIKE ? OR p.title_hi LIKE ? OR p.description_en LIKE ? OR p.description_hi LIKE ?)';
        const searchTerm = `%${searchParams.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
      
      // Get total count for pagination
      const countQuery = `SELECT COUNT(*) as total FROM products p WHERE p.is_active = 1` + query.substring(query.indexOf(' AND'));
      const [countResult] = await pool.execute(countQuery, params);
      const totalProducts = (countResult as any[])[0].total;
      
      // Add ordering and pagination
      query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const [rows] = await pool.execute(query, params);
      
      // Enhance products with images
      const products = await Promise.all((rows as any[]).map(async (product) => {
        // Get product images
        const [images] = await pool.execute(
          'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
          [product.id]
        );
        
        return {
          id: product.id,
          slug: product.slug,
          title: { en: product.title_en, hi: product.title_hi },
          description: { en: product.description_en, hi: product.description_hi },
          price: product.price,
          originalPrice: product.original_price,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.review_count,
          categoryId: product.category_id,
          artisanId: product.artisan_id,
          featured: product.featured,
          bestSeller: product.best_seller,
          newArrival: product.new_arrival,
          trending: product.trending,
          isActive: product.is_active,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
          category: product.category_id ? {
            id: product.category_id,
            name: { en: product.category_name_en, hi: product.category_name_hi }
          } : null,
          artisan: product.artisan_id ? {
            id: product.artisan_id,
            name: product.artisan_name
          } : null,
          productImages: (images as any[]).map(img => ({
            id: img.id,
            url: img.image_url,
            isPrimary: img.is_primary,
            displayOrder: img.display_order
          }))
        };
      }));
      
      return {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasNextPage: page < Math.ceil(totalProducts / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  },

  async createProduct(productData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO products (slug, title_en, title_hi, description_en, description_hi, price, original_price, 
         stock, rating, review_count, category_id, artisan_id, featured, best_seller, new_arrival, trending, 
         is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          productData.slug,
          productData.title.en,
          productData.title.hi,
          productData.description.en,
          productData.description.hi,
          productData.price,
          productData.originalPrice,
          productData.stock,
          productData.rating || 0,
          productData.reviewCount || 0,
          productData.categoryId,
          productData.artisanId,
          productData.featured ? 1 : 0,
          productData.bestSeller ? 1 : 0,
          productData.newArrival ? 1 : 0,
          productData.trending ? 1 : 0,
          productData.isActive ? 1 : 0
        ]
      );
      
      const productId = (result as any).insertId;
      
      // Insert product images if provided
      if (productData.productImages && productData.productImages.length > 0) {
        for (const image of productData.productImages) {
          await pool.execute(
            `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              productId,
              image.url,
              image.alt || '',
              image.isPrimary ? 1 : 0,
              image.displayOrder || 0
            ]
          );
        }
      }
      
      // Fetch the created product
      return await this.getProductBySlug(productData.slug);
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  // Cart operations
  async getCartItems(userId: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT c.*, p.title_en, p.title_hi, p.price, p.original_price, p.stock, pi.image_url as primary_image
         FROM carts c
         JOIN products p ON c.product_id = p.id
         LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
         WHERE c.user_id = ?`,
        [userId]
      );
      
      return (rows as any[]).map(item => ({
        id: item.id,
        userId: item.user_id,
        productId: item.product_id,
        quantity: item.quantity,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        product: {
          id: item.product_id,
          title: { en: item.title_en, hi: item.title_hi },
          price: item.price,
          originalPrice: item.original_price,
          stock: item.stock,
          primaryImage: item.primary_image
        }
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<any> {
    try {
      console.log('Adding to cart:', { userId, productId, quantity });
      
      // Check if item already exists in cart
      const [existing] = await pool.execute(
        'SELECT * FROM carts WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      
      if ((existing as any[]).length > 0) {
        // Update quantity if item exists
        const newQuantity = (existing as any[])[0].quantity + quantity;
        const [result] = await pool.execute(
          'UPDATE carts SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
          [newQuantity, userId, productId]
        );
        return { id: (existing as any[])[0].id, user_id: userId, product_id: productId, quantity: newQuantity };
      } else {
        // Add new item to cart
        const cartId = `cart-${Date.now()}`;
        const [result] = await pool.execute(
          'INSERT INTO carts (id, user_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [cartId, userId, productId, quantity]
        );
        return { id: cartId, user_id: userId, product_id: productId, quantity: quantity };
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async removeFromCart(userId: string, productId: string, variant?: any): Promise<boolean> {
    try {
      console.log('Removing from cart:', { userId, productId, variant });
      // If variant is provided, we need to handle it properly
      // For now, we'll remove by product_id only since the current schema doesn't fully support variants
      const [result] = await pool.execute(
        'DELETE FROM carts WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      console.log('Delete result:', result);
      const affectedRows = (result as any).affectedRows;
      console.log('Affected rows:', affectedRows);
      return affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },

  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'UPDATE carts SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },

  async clearCart(userId: string): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'DELETE FROM carts WHERE user_id = ?',
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },

  // Order operations
  async createOrder(orderData: any): Promise<any> {
    try {
      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {
        // Create order
        const [orderResult] = await connection.execute(
          `INSERT INTO orders (user_id, total_amount, status, payment_method, payment_status, 
           shipping_address, billing_address, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            orderData.userId,
            orderData.totalAmount,
            orderData.status || 'pending',
            orderData.paymentMethod,
            orderData.paymentStatus || 'pending',
            JSON.stringify(orderData.shippingAddress),
            JSON.stringify(orderData.billingAddress)
          ]
        );
        
        const orderId = (orderResult as any).insertId;
        
        // Create order items
        for (const item of orderData.items) {
          await connection.execute(
            `INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) 
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [
              orderId,
              item.productId,
              item.quantity,
              item.price
            ]
          );
        }
        
        // Clear user's cart
        await connection.execute(
          'DELETE FROM carts WHERE user_id = ?',
          [orderData.userId]
        );
        
        // Commit transaction
        await connection.commit();
        connection.release();
        
        // Return order details
        return {
          id: orderId,
          userId: orderData.userId,
          totalAmount: orderData.totalAmount,
          status: orderData.status || 'pending',
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus || 'pending',
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.billingAddress,
          items: orderData.items,
          createdAt: new Date()
        };
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  // Admin operations
  async getAllProducts(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
         c.id as category_id, a.name as artisan_name, a.id as artisan_id
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN artisans a ON p.artisan_id = a.id
         WHERE p.is_active = 1
         ORDER BY p.created_at DESC`
      );
      
      // Enhance products with images
      const products = await Promise.all((rows as any[]).map(async (product) => {
        // Get product images
        const [images] = await pool.execute(
          'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
          [product.id]
        );
        
        return {
          id: product.id,
          slug: product.slug,
          title: { en: product.title_en, hi: product.title_hi },
          description: { en: product.description_en, hi: product.description_hi },
          price: product.price,
          originalPrice: product.original_price,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.review_count,
          categoryId: product.category_id,
          artisanId: product.artisan_id,
          featured: product.featured,
          bestSeller: product.best_seller,
          newArrival: product.new_arrival,
          trending: product.trending,
          isActive: product.is_active,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
          category: product.category_id ? {
            id: product.category_id,
            name: { en: product.category_name_en, hi: product.category_name_hi }
          } : null,
          artisan: product.artisan_id ? {
            id: product.artisan_id,
            name: product.artisan_name
          } : null,
          productImages: (images as any[]).map(img => ({
            id: img.id,
            url: img.image_url,
            isPrimary: img.is_primary,
            displayOrder: img.display_order
          }))
        };
      }));
      
      return products;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async getAllCategories(): Promise<any[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order');
      return (rows as any[]).map(category => ({
        id: category.id,
        name: { en: category.name_en, hi: category.name_hi },
        slug: category.slug,
        description: { en: category.description_en, hi: category.description_hi },
        image_url: category.image_url,
        display_order: category.display_order,
        is_active: Number(category.is_active),
        created_at: category.created_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async getAllArtisans(): Promise<any[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM artisans');
      return (rows as any[]).map(artisan => {
        // Parse location field if it exists
        let village = '';
        let district = '';
        let state = '';
        
        if (artisan.location) {
          const locationParts = artisan.location.split(',').map((s: string) => s.trim());
          village = locationParts[0] || '';
          district = locationParts[1] || '';
          state = locationParts[2] || '';
        }
        
        return {
          id: artisan.id,
          name: artisan.name,
          slug: artisan.id,
          bio: { en: artisan.bio_en, hi: artisan.bio_hi },
          village: village,
          district: district,
          state: state,
          phone: artisan.phone || '',
          email: artisan.email || '',
          photo: artisan.avatar || '/images/artisans/placeholder.jpg',
          skills: artisan.specialization ? artisan.specialization.split(',').map((s: string) => s.trim()) : [],
          experience: artisan.experience_years || 0,
          rating: artisan.rating || 0,
          totalProducts: artisan.total_products || 0,
          isVerified: artisan.is_verified === 1,
          isActive: artisan.is_active === 1
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async getAllBanners(): Promise<any[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order');
      return (rows as any[]).map(banner => ({
        id: banner.id,
        title: { en: banner.title_en, hi: banner.title_hi },
        subtitle: { en: banner.subtitle_en, hi: banner.subtitle_hi },
        description: { en: banner.description_en, hi: banner.description_hi },
        image_desktop: banner.image_desktop,
        image_mobile: banner.image_mobile,
        link_url: banner.link_url,
        link_text: { en: banner.link_text_en, hi: banner.link_text_hi },
        display_order: banner.display_order,
        is_active: Number(banner.is_active), // Ensure it's a number
        created_at: banner.created_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async getDashboardStats(): Promise<any> {
    try {
      // Get total products
      const [productResult] = await pool.execute('SELECT COUNT(*) as total FROM products WHERE is_active = 1');
      const totalProducts = (productResult as any[])[0].total;
      
      // Get total orders
      const [orderResult] = await pool.execute('SELECT COUNT(*) as total FROM orders');
      const totalOrders = (orderResult as any[])[0].total;
      
      // Get total users
      const [userResult] = await pool.execute('SELECT COUNT(*) as total FROM users');
      const totalUsers = (userResult as any[])[0].total;
      
      // Get total artisans
      const [artisanResult] = await pool.execute('SELECT COUNT(*) as total FROM artisans WHERE is_active = 1');
      const totalArtisans = (artisanResult as any[])[0].total;
      
      return {
        totalProducts,
        totalOrders,
        totalUsers,
        totalArtisans
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalArtisans: 0
      };
    }
  },
  
  async getTotalRevenue(): Promise<number> {
    try {
      const [result] = await pool.execute('SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"');
      return (result as any[])[0].total || 0;
    } catch (error) {
      console.error('Database error:', error);
      return 0;
    }
  },
  
  async getRecentOrders(limit: number = 5): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT o.*, u.name as customer_name, u.email as customer_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC
         LIMIT ?`,
        [limit]
      );
      
      return (rows as any[]).map(order => ({
        id: order.id,
        customer: {
          id: order.user_id,
          name: order.customer_name,
          email: order.customer_email
        },
        totalAmount: order.total_amount,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        createdAt: order.created_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async getAllOrders(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT o.*, u.name as customer_name, u.email as customer_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );
      
      return (rows as any[]).map(order => ({
        id: order.id,
        customer: {
          id: order.user_id,
          name: order.customer_name,
          email: order.customer_email
        },
        totalAmount: order.total_amount,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        createdAt: order.created_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async getOrdersByUserId(userId: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT o.*, u.name as customer_name, u.email as customer_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.user_id = ?
         ORDER BY o.created_at DESC`,
        [userId]
      );
      
      return (rows as any[]).map(order => ({
        id: order.id,
        customer: {
          id: order.user_id,
          name: order.customer_name,
          email: order.customer_email
        },
        totalAmount: order.total_amount,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        createdAt: order.created_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async getOrderById(orderId: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        `SELECT o.*, u.name as customer_name, u.email as customer_email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId]
      );
      
      const order = (rows as any[])[0];
      if (!order) return null;
      
      // Get order items
      const [items] = await pool.execute(
        `SELECT oi.*, p.title_en, p.title_hi
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId]
      );
      
      return {
        id: order.id,
        customer: {
          id: order.user_id,
          name: order.customer_name,
          email: order.customer_email
        },
        totalAmount: order.total_amount,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        shippingAddress: JSON.parse(order.shipping_address),
        billingAddress: JSON.parse(order.billing_address),
        items: (items as any[]).map(item => ({
          id: item.id,
          productId: item.product_id,
          productName: { en: item.title_en, hi: item.title_hi },
          quantity: item.quantity,
          price: item.price
        })),
        createdAt: order.created_at
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async updateOrder(orderId: string, updateData: any): Promise<any | null> {
    try {
      const [result] = await pool.execute(
        `UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          updateData.status,
          updateData.paymentStatus,
          orderId
        ]
      );
      
      if ((result as any).affectedRows > 0) {
        return await this.getOrderById(orderId);
      }
      
      return null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async getUserAddresses(userId: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM user_addresses WHERE user_id = ?',
        [userId]
      );
      
      return (rows as any[]).map(address => ({
        id: address.id,
        userId: address.user_id,
        fullName: address.full_name,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zip_code,
        country: address.country,
        phone: address.phone,
        isDefault: address.is_default === 1
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  async createUserAddress(userId: string, addressData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO user_addresses (user_id, full_name, street, city, state, zip_code, country, phone, is_default, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          addressData.fullName,
          addressData.street,
          addressData.city,
          addressData.state,
          addressData.zipCode,
          addressData.country,
          addressData.phone,
          addressData.isDefault ? 1 : 0
        ]
      );
      
      const addressId = (result as any).insertId;
      
      // Fetch the created address
      const [rows] = await pool.execute(
        'SELECT * FROM user_addresses WHERE id = ?',
        [addressId]
      );
      
      const address = (rows as any[])[0];
      return {
        id: address.id,
        userId: address.user_id,
        fullName: address.full_name,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zip_code,
        country: address.country,
        phone: address.phone,
        isDefault: address.is_default === 1
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async createArtisan(artisanData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO artisans (name, bio_en, bio_hi, location, phone, email, avatar, specialization, 
         experience_years, rating, total_products, is_verified, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          artisanData.name,
          artisanData.bio?.en || '',
          artisanData.bio?.hi || '',
          `${artisanData.village}, ${artisanData.district}, ${artisanData.state}`,
          artisanData.phone || '',
          artisanData.email || '',
          artisanData.photo || '/images/artisans/placeholder.jpg',
          artisanData.skills ? artisanData.skills.join(', ') : '',
          artisanData.experience || 0,
          artisanData.rating || 0,
          artisanData.totalProducts || 0,
          artisanData.isVerified ? 1 : 0,
          artisanData.isActive ? 1 : 0
        ]
      );
      
      const artisanId = (result as any).insertId;
      
      // Fetch the created artisan
      const [rows] = await pool.execute(
        'SELECT * FROM artisans WHERE id = ?',
        [artisanId]
      );
      
      const artisan = (rows as any[])[0];
      
      // Parse location field if it exists
      let village = '';
      let district = '';
      let state = '';
      
      if (artisan.location) {
        const locationParts = artisan.location.split(',').map((s: string) => s.trim());
        village = locationParts[0] || '';
        district = locationParts[1] || '';
        state = locationParts[2] || '';
      }
      
      return {
        id: artisan.id,
        name: artisan.name,
        slug: artisan.id,
        bio: { en: artisan.bio_en, hi: artisan.bio_hi },
        village: village,
        district: district,
        state: state,
        phone: artisan.phone || '',
        email: artisan.email || '',
        photo: artisan.avatar || '/images/artisans/placeholder.jpg',
        skills: artisan.specialization ? artisan.specialization.split(',').map((s: string) => s.trim()) : [],
        experience: artisan.experience_years || 0,
        rating: artisan.rating || 0,
        totalProducts: artisan.total_products || 0,
        isVerified: artisan.is_verified === 1,
        isActive: artisan.is_active === 1
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  // Add updateArtisan method
  async updateArtisan(id: string, artisanData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `UPDATE artisans SET name = ?, bio_en = ?, bio_hi = ?, location = ?, phone = ?, email = ?, 
         avatar = ?, specialization = ?, experience_years = ?, rating = ?, total_products = ?, 
         is_verified = ?, is_active = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          artisanData.name,
          artisanData.bio?.en || '',
          artisanData.bio?.hi || '',
          `${artisanData.village}, ${artisanData.district}, ${artisanData.state}`,
          artisanData.phone || '',
          artisanData.email || '',
          artisanData.photo || '/images/artisans/placeholder.jpg',
          artisanData.skills ? artisanData.skills.join(', ') : '',
          artisanData.experience || 0,
          artisanData.rating || 0,
          artisanData.totalProducts || 0,
          artisanData.isVerified ? 1 : 0,
          artisanData.isActive ? 1 : 0,
          id
        ]
      );
      
      if ((result as any).affectedRows > 0) {
        return await this.getArtisanById(id);
      }
      
      return null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async getArtisanById(id: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM artisans WHERE id = ?',
        [id]
      );
      
      const artisan = (rows as any[])[0];
      if (!artisan) return null;
      
      // Parse location field if it exists
      let village = '';
      let district = '';
      let state = '';
      
      if (artisan.location) {
        const locationParts = artisan.location.split(',').map((s: string) => s.trim());
        village = locationParts[0] || '';
        district = locationParts[1] || '';
        state = locationParts[2] || '';
      }
      
      return {
        id: artisan.id,
        name: artisan.name,
        slug: artisan.id,
        bio: { en: artisan.bio_en, hi: artisan.bio_hi },
        village: village,
        district: district,
        state: state,
        phone: artisan.phone || '',
        email: artisan.email || '',
        photo: artisan.avatar || '/images/artisans/placeholder.jpg',
        skills: artisan.specialization ? artisan.specialization.split(',').map((s: string) => s.trim()) : [],
        experience: artisan.experience_years || 0,
        rating: artisan.rating || 0,
        totalProducts: artisan.total_products || 0,
        isVerified: artisan.is_verified === 1,
        isActive: artisan.is_active === 1
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  // Add deleteArtisan method
  async deleteArtisan(id: string): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'DELETE FROM artisans WHERE id = ?',
        [id]
      );
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },
  
  async createBanner(bannerData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO banners (title_en, title_hi, subtitle_en, subtitle_hi, description_en, description_hi, 
         image_desktop, image_mobile, link_url, link_text_en, link_text_hi, display_order, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          bannerData.title?.en || '',
          bannerData.title?.hi || '',
          bannerData.subtitle?.en || '',
          bannerData.subtitle?.hi || '',
          bannerData.description?.en || '',
          bannerData.description?.hi || '',
          bannerData.image_desktop || '',
          bannerData.image_mobile || '',
          bannerData.link_url || '',
          bannerData.link_text?.en || '',
          bannerData.link_text?.hi || '',
          bannerData.display_order || 0,
          bannerData.is_active ? 1 : 0
        ]
      );
      
      const bannerId = (result as any).insertId;
      
      // Fetch the created banner
      const [rows] = await pool.execute(
        'SELECT * FROM banners WHERE id = ?',
        [bannerId]
      );
      
      const banner = (rows as any[])[0];
      return {
        id: banner.id,
        title: { en: banner.title_en, hi: banner.title_hi },
        subtitle: { en: banner.subtitle_en, hi: banner.subtitle_hi },
        description: { en: banner.description_en, hi: banner.description_hi },
        image_desktop: banner.image_desktop,
        image_mobile: banner.image_mobile,
        link_url: banner.link_url,
        link_text: { en: banner.link_text_en, hi: banner.link_text_hi },
        display_order: banner.display_order,
        is_active: Number(banner.is_active),
        created_at: banner.created_at
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  // Add updateBanner method
  async updateBanner(id: string, bannerData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `UPDATE banners SET title_en = ?, title_hi = ?, subtitle_en = ?, subtitle_hi = ?, description_en = ?, 
         description_hi = ?, image_desktop = ?, image_mobile = ?, link_url = ?, link_text_en = ?, 
         link_text_hi = ?, display_order = ?, is_active = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          bannerData.title?.en || '',
          bannerData.title?.hi || '',
          bannerData.subtitle?.en || '',
          bannerData.subtitle?.hi || '',
          bannerData.description?.en || '',
          bannerData.description?.hi || '',
          bannerData.image_desktop || '',
          bannerData.image_mobile || '',
          bannerData.link_url || '',
          bannerData.link_text?.en || '',
          bannerData.link_text?.hi || '',
          bannerData.display_order || 0,
          bannerData.is_active ? 1 : 0,
          id
        ]
      );
      
      if ((result as any).affectedRows > 0) {
        return await this.getBannerById(id);
      }
      
      return null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async getBannerById(id: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM banners WHERE id = ?',
        [id]
      );
      
      const banner = (rows as any[])[0];
      if (!banner) return null;
      
      return {
        id: banner.id,
        title: { en: banner.title_en, hi: banner.title_hi },
        subtitle: { en: banner.subtitle_en, hi: banner.subtitle_hi },
        description: { en: banner.description_en, hi: banner.description_hi },
        image_desktop: banner.image_desktop,
        image_mobile: banner.image_mobile,
        link_url: banner.link_url,
        link_text: { en: banner.link_text_en, hi: banner.link_text_hi },
        display_order: banner.display_order,
        is_active: Number(banner.is_active),
        created_at: banner.created_at
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  // Add deleteBanner method
  async deleteBanner(id: string): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'DELETE FROM banners WHERE id = ?',
        [id]
      );
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },
  
  async createCategory(categoryData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO categories (name_en, name_hi, slug, description_en, description_hi, image_url, 
         display_order, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          categoryData.name?.en || '',
          categoryData.name?.hi || '',
          categoryData.slug || '',
          categoryData.description?.en || '',
          categoryData.description?.hi || '',
          categoryData.image_url || '',
          categoryData.display_order || 0,
          categoryData.is_active ? 1 : 0
        ]
      );
      
      const categoryId = (result as any).insertId;
      
      // Fetch the created category
      const [rows] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [categoryId]
      );
      
      const category = (rows as any[])[0];
      return {
        id: category.id,
        name: { en: category.name_en, hi: category.name_hi },
        slug: category.slug,
        description: { en: category.description_en, hi: category.description_hi },
        image_url: category.image_url,
        display_order: category.display_order,
        is_active: Number(category.is_active),
        created_at: category.created_at
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  // Add updateCategory method
  async updateCategory(id: string, categoryData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `UPDATE categories SET name_en = ?, name_hi = ?, slug = ?, description_en = ?, description_hi = ?, 
         image_url = ?, display_order = ?, is_active = ?, updated_at = NOW() 
         WHERE id = ?`,
        [
          categoryData.name?.en || '',
          categoryData.name?.hi || '',
          categoryData.slug || '',
          categoryData.description?.en || '',
          categoryData.description?.hi || '',
          categoryData.image_url || '',
          categoryData.display_order || 0,
          categoryData.is_active ? 1 : 0,
          id
        ]
      );
      
      if ((result as any).affectedRows > 0) {
        return await this.getCategoryById(id);
      }
      
      return null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async getCategoryById(id: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      
      const category = (rows as any[])[0];
      if (!category) return null;
      
      return {
        id: category.id,
        name: { en: category.name_en, hi: category.name_hi },
        slug: category.slug,
        description: { en: category.description_en, hi: category.description_hi },
        image_url: category.image_url,
        display_order: category.display_order,
        is_active: Number(category.is_active),
        created_at: category.created_at
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  // Add deleteCategory method
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'DELETE FROM categories WHERE id = ?',
        [id]
      );
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },
  
  // Add updateProduct method
  async updateProduct(id: string, productData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `UPDATE products SET slug = ?, title_en = ?, title_hi = ?, description_en = ?, description_hi = ?, 
         price = ?, original_price = ?, stock = ?, rating = ?, review_count = ?, category_id = ?, 
         artisan_id = ?, featured = ?, best_seller = ?, new_arrival = ?, trending = ?, is_active = ?, 
         updated_at = NOW() 
         WHERE id = ?`,
        [
          productData.slug,
          productData.title?.en || '',
          productData.title?.hi || '',
          productData.description?.en || '',
          productData.description?.hi || '',
          productData.price,
          productData.originalPrice,
          productData.stock,
          productData.rating || 0,
          productData.reviewCount || 0,
          productData.categoryId,
          productData.artisanId,
          productData.featured ? 1 : 0,
          productData.bestSeller ? 1 : 0,
          productData.newArrival ? 1 : 0,
          productData.trending ? 1 : 0,
          productData.isActive ? 1 : 0,
          id
        ]
      );
      
      if ((result as any).affectedRows > 0) {
        // Update product images if provided
        if (productData.productImages) {
          // First delete existing images
          await pool.execute(
            'DELETE FROM product_images WHERE product_id = ?',
            [id]
          );
          
          // Then insert new images
          for (const image of productData.productImages) {
            await pool.execute(
              `INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order, created_at, updated_at) 
               VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
              [
                id,
                image.url,
                image.alt || '',
                image.isPrimary ? 1 : 0,
                image.displayOrder || 0
              ]
            );
          }
        }
        
        return await this.getProductById(id);
      }
      
      return null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async getProductById(id: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
         c.id as category_id, a.name as artisan_name, a.id as artisan_id
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN artisans a ON p.artisan_id = a.id
         WHERE p.id = ?`,
        [id]
      );
      
      const product = (rows as any[])[0];
      if (!product) return null;
      
      // Get product images
      const [images] = await pool.execute(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
        [product.id]
      );
      
      return {
        id: product.id,
        slug: product.slug,
        title: { en: product.title_en, hi: product.title_hi },
        description: { en: product.description_en, hi: product.description_hi },
        price: product.price,
        originalPrice: product.original_price,
        stock: product.stock,
        rating: product.rating,
        reviewCount: product.review_count,
        categoryId: product.category_id,
        artisanId: product.artisan_id,
        featured: product.featured,
        bestSeller: product.best_seller,
        newArrival: product.new_arrival,
        trending: product.trending,
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        category: product.category_id ? {
          id: product.category_id,
          name: { en: product.category_name_en, hi: product.category_name_hi }
        } : null,
        artisan: product.artisan_id ? {
          id: product.artisan_id,
          name: product.artisan_name
        } : null,
        productImages: (images as any[]).map(img => ({
          id: img.id,
          url: img.image_url,
          isPrimary: img.is_primary,
          displayOrder: img.display_order
        }))
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  // Add deleteProduct method
  async deleteProduct(id: string): Promise<boolean> {
    try {
      // First delete related product images
      await pool.execute(
        'DELETE FROM product_images WHERE product_id = ?',
        [id]
      );
      
      // Then delete the product
      const [result] = await pool.execute(
        'DELETE FROM products WHERE id = ?',
        [id]
      );
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },

  // Get all admin users
  async getAllAdminUsers(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT id, email, name FROM users WHERE role IN (?, ?)',
        ['admin', 'super_admin']
      );
      
      return (rows as any[]).map(user => ({
        id: user.id,
        email: user.email,
        name: user.name
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },
  
  // Contact request operations
  async createContactRequest(contactData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO contact_requests (name, email, subject, message, created_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [
          contactData.name,
          contactData.email,
          contactData.subject,
          contactData.message
        ]
      );
      
      const requestId = (result as any).insertId;
      
      // Fetch the created request
      const [rows] = await pool.execute(
        'SELECT * FROM contact_requests WHERE id = ?',
        [requestId]
      );
      
      return (rows as any[])[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async getAllContactRequests(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM contact_requests ORDER BY created_at DESC'
      );
      
      return (rows as any[]);
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  // Sell request operations
  async createSellRequest(sellData: any): Promise<any> {
    try {
      const [result] = await pool.execute(
        `INSERT INTO sell_requests (name, email, phone, product_name, product_description, 
         product_category, product_images, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          sellData.name,
          sellData.email,
          sellData.phone,
          sellData.productName,
          sellData.productDescription,
          sellData.productCategory,
          sellData.productImages ? JSON.stringify(sellData.productImages) : null
        ]
      );
      
      const requestId = (result as any).insertId;
      
      // Fetch the created request
      const [rows] = await pool.execute(
        'SELECT * FROM sell_requests WHERE id = ?',
        [requestId]
      );
      
      const request = (rows as any[])[0];
      return {
        ...request,
        product_images: request.product_images ? JSON.parse(request.product_images) : null
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async getAllSellRequests(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM sell_requests ORDER BY created_at DESC'
      );
      
      return (rows as any[]).map(request => ({
        ...request,
        product_images: request.product_images ? JSON.parse(request.product_images) : null
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  // Analytics operations
  async getSalesOverview(): Promise<any> {
    try {
      // Get total revenue
      const [revenueResult] = await pool.execute(
        'SELECT SUM(total_amount) as totalRevenue FROM orders WHERE status = "completed"'
      );
      const totalRevenue = (revenueResult as any[])[0].totalRevenue || 0;
      
      // Get total orders
      const [ordersResult] = await pool.execute(
        'SELECT COUNT(*) as totalOrders FROM orders WHERE status = "completed"'
      );
      const totalOrders = (ordersResult as any[])[0].totalOrders || 0;
      
      // Get average order value
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Get top selling category (simplified)
      const [categoryResult] = await pool.execute(`
        SELECT c.name_en as categoryName, COUNT(oi.id) as orderCount
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = "completed"
        GROUP BY c.id, c.name_en
        ORDER BY orderCount DESC
        LIMIT 1
      `);
      const topSellingCategory = (categoryResult as any[])[0]?.categoryName || 'N/A';
      
      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topSellingCategory
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        topSellingCategory: 'N/A'
      };
    }
  },

  async getTopCategories(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT c.name_en as categoryName, c.name_hi as categoryNameHi, COUNT(oi.id) as orderCount
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = "completed"
        GROUP BY c.id, c.name_en, c.name_hi
        ORDER BY orderCount DESC
        LIMIT 5
      `);
      
      return (rows as any[]).map(row => ({
        name: { en: row.categoryName, hi: row.categoryNameHi },
        orderCount: row.orderCount
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getTopProducts(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT p.title_en as productName, p.title_hi as productNameHi, SUM(oi.quantity) as totalSold
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status = "completed"
        GROUP BY p.id, p.title_en, p.title_hi
        ORDER BY totalSold DESC
        LIMIT 5
      `);
      
      return (rows as any[]).map(row => ({
        name: { en: row.productName, hi: row.productNameHi },
        totalSold: row.totalSold
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getCustomerGrowth(): Promise<any> {
    try {
      // Get new customers (registered in last 30 days)
      const [newCustomersResult] = await pool.execute(`
        SELECT COUNT(*) as newCustomers
        FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
      const newCustomers = (newCustomersResult as any[])[0].newCustomers || 0;
      
      // Get returning customers (customers with more than 1 order)
      const [returningCustomersResult] = await pool.execute(`
        SELECT COUNT(DISTINCT user_id) as returningCustomers
        FROM orders
        WHERE status = "completed"
        GROUP BY user_id
        HAVING COUNT(*) > 1
      `);
      const returningCustomers = (returningCustomersResult as any[]).length || 0;
      
      // Calculate growth rate (simplified)
      const totalCustomersResult = await pool.execute('SELECT COUNT(*) as total FROM users');
      const totalCustomers = (totalCustomersResult[0] as any[])[0].total || 1;
      const growthRate = (newCustomers / totalCustomers) * 100;
      
      return {
        newCustomers,
        returningCustomers,
        growthRate
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        newCustomers: 0,
        returningCustomers: 0,
        growthRate: 0
      };
    }
  },

  async getReturnsReport(): Promise<any> {
    try {
      // Get total orders
      const [totalOrdersResult] = await pool.execute('SELECT COUNT(*) as total FROM orders WHERE status = "completed"');
      const totalOrders = (totalOrdersResult as any[])[0].total || 1;
      
      // Get returned orders (simplified - using a status)
      const [returnedOrdersResult] = await pool.execute('SELECT COUNT(*) as returned FROM orders WHERE status = "returned"');
      const returnedOrders = (returnedOrdersResult as any[])[0].returned || 0;
      
      // Calculate return percentage
      const returnPercentage = (returnedOrders / totalOrders) * 100;
      
      // Get refund amount (simplified)
      const [refundResult] = await pool.execute('SELECT SUM(total_amount) as refundAmount FROM orders WHERE status = "returned"');
      const refundAmount = (refundResult as any[])[0].refundAmount || 0;
      
      return {
        returnPercentage,
        refundAmount
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        returnPercentage: 0,
        refundAmount: 0
      };
    }
  }
};

export { serverDb as db };