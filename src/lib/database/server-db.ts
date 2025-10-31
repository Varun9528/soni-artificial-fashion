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
export const serverDb = {
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

  // Banner operations
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
  }
};

// Export the serverDb object
export { serverDb as db };

        created_at: category.created_at
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
  // Admin operations
  async getAllProducts(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, c.name_en as category_name_en, c.name_hi as category_name_hi, 
        c.id as category_id, a.name as artisan_name, a.id as artisan_id
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN artisans a ON p.artisan_id = a.id
        ORDER BY p.created_at DESC
      `);
      
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
            alt: img.alt_text,
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
      // Get categories with product counts
      const [rows] = await pool.execute(`
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        GROUP BY c.id
        ORDER BY c.display_order
      `);
      
      return (rows as any[]).map(category => ({
        id: category.id,
        name: { en: category.name_en, hi: category.name_hi },
        description: { en: category.description_en, hi: category.description_hi },
        image: category.image,
        parentId: category.parent_id,
        displayOrder: category.display_order,
        isActive: category.is_active,
        productCount: category.product_count, // Include product count
        createdAt: category.created_at
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
      const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM products');
      const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
      const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
      const [artisanCount] = await pool.execute('SELECT COUNT(*) as count FROM artisans');
      
      return {
        totalProducts: (productCount as any[])[0].count,
        totalOrders: (orderCount as any[])[0].count,
        totalUsers: (userCount as any[])[0].count,
        totalArtisans: (artisanCount as any[])[0].count
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
      const [rows] = await pool.execute('SELECT COALESCE(SUM(total_amount), 0) as totalRevenue FROM orders');
      return (rows as any[])[0].totalRevenue;
    } catch (error) {
      console.error('Database error:', error);
      return 0;
    }
  },
  
  // User operations
  async findUserByEmail(email: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      const user = (rows as any[])[0];
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        password_hash: user.password_hash,
        name: user.name,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
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
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        password_hash: user.password_hash,
        name: user.name,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },
  
  async createUser(userData: any): Promise<any> {
    try {
      const userId = `user-${Date.now()}`;
      const [result] = await pool.execute(
        `INSERT INTO users (id, email, password_hash, name, phone, role, email_verified, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          userId,
          userData.email,
          userData.password_hash,
          userData.name,
          userData.phone,
          userData.role || 'customer',
          userData.email_verified || false
        ]
      );
      
      return {
        id: userId,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'customer',
        email_verified: userData.email_verified || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  async updateUser(id: string, userData: any): Promise<any | null> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      
      // Build dynamic update query
      if (userData.email !== undefined) {
        fields.push('email = ?');
        values.push(userData.email);
      }
      if (userData.password_hash !== undefined) {
        fields.push('password_hash = ?');
        values.push(userData.password_hash);
      }
      if (userData.name !== undefined) {
        fields.push('name = ?');
        values.push(userData.name);
      }
      if (userData.phone !== undefined) {
        fields.push('phone = ?');
        values.push(userData.phone);
      }
      if (userData.role !== undefined) {
        fields.push('role = ?');
        values.push(userData.role);
      }
      if (userData.email_verified !== undefined) {
        fields.push('email_verified = ?');
        values.push(userData.email_verified);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = NOW()');
      
      if (fields.length === 0) return null;
      
      values.push(id);
      
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(query, values);
      
      if ((result as any).affectedRows === 0) return null;
      
      // Return updated user
      return await this.findUserById(id);
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  // Contact and Sell request operations
  
  async createContactRequest(contactData: any): Promise<any> {
    try {
      const contactId = `contact-${Date.now()}`;
      const [result] = await pool.execute(
        `INSERT INTO contact_requests (id, name, email, subject, message, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          contactId,
          contactData.name,
          contactData.email,
          contactData.subject,
          contactData.message
        ]
      );
      
      return {
        id: contactId,
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async createSellRequest(sellData: any): Promise<any> {
    try {
      const sellId = `sell-${Date.now()}`;
      const [result] = await pool.execute(
        `INSERT INTO sell_requests (id, name, email, phone, business_name, business_type, products, message, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          sellId,
          sellData.name,
          sellData.email,
          sellData.phone,
          sellData.businessName,
          sellData.businessType,
          sellData.products,
          sellData.message
        ]
      );
      
      return {
        id: sellId,
        name: sellData.name,
        email: sellData.email,
        phone: sellData.phone,
        business_name: sellData.businessName,
        business_type: sellData.businessType,
        products: sellData.products,
        message: sellData.message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async getAllContactRequests(): Promise<any[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM contact_requests ORDER BY created_at DESC');
      return (rows as any[]).map(request => ({
        id: request.id,
        name: request.name,
        email: request.email,
        subject: request.subject,
        message: request.message,
        created_at: request.created_at,
        updated_at: request.updated_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getAllSellRequests(): Promise<any[]> {
    try {
      const [rows] = await pool.execute('SELECT * FROM sell_requests ORDER BY created_at DESC');
      return (rows as any[]).map(request => ({
        id: request.id,
        name: request.name,
        email: request.email,
        phone: request.phone,
        business_name: request.business_name,
        business_type: request.business_type,
        products: request.products,
        message: request.message,
        created_at: request.created_at,
        updated_at: request.updated_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getSalesOverview(): Promise<any> {
    try {
      // Get total revenue
      const [revenueResult] = await pool.execute('SELECT COALESCE(SUM(total_amount), 0) as totalRevenue FROM orders WHERE status = "DELIVERED"');
      const totalRevenue = (revenueResult as any[])[0].totalRevenue;

      // Get total orders
      const [ordersResult] = await pool.execute('SELECT COUNT(*) as totalOrders FROM orders');
      const totalOrders = (ordersResult as any[])[0].totalOrders;

      // Get average order value
      const [avgOrderResult] = await pool.execute('SELECT COALESCE(AVG(total_amount), 0) as avgOrderValue FROM orders WHERE status = "DELIVERED"');
      const avgOrderValue = (avgOrderResult as any[])[0].avgOrderValue;

      // Get top selling category
      const [topCategoryResult] = await pool.execute(`
        SELECT c.name_en as categoryName, COUNT(oi.id) as productCount
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        GROUP BY c.id, c.name_en
        ORDER BY productCount DESC
        LIMIT 1
      `);
      const topSellingCategory = (topCategoryResult as any[])[0]?.categoryName || 'N/A';

      return {
        totalRevenue: parseFloat(totalRevenue),
        totalOrders: parseInt(totalOrders),
        averageOrderValue: parseFloat(avgOrderValue),
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
        SELECT c.name_en as categoryName, 
               COALESCE(SUM(oi.quantity * oi.price), 0) as revenue,
               COUNT(oi.id) as salesCount
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'DELIVERED'
        GROUP BY c.id, c.name_en
        ORDER BY revenue DESC
        LIMIT 6
      `);

      // Calculate total revenue for percentage calculation
      const totalRevenue = (rows as any[]).reduce((sum, row) => sum + parseFloat(row.revenue), 0);

      return (rows as any[]).map(row => ({
        name: row.categoryName,
        revenue: parseFloat(row.revenue),
        percentage: totalRevenue > 0 ? (parseFloat(row.revenue) / totalRevenue) * 100 : 0
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getTopProducts(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT p.title_en as productName,
               COUNT(oi.id) as salesCount,
               COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        JOIN orders o ON oi.order_id = o.id AND o.status = 'DELIVERED'
        GROUP BY p.id, p.title_en
        ORDER BY revenue DESC
        LIMIT 5
      `);

      return (rows as any[]).map(row => ({
        name: row.productName,
        sales: parseInt(row.salesCount),
        revenue: parseFloat(row.revenue)
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getCustomerGrowth(): Promise<any> {
    try {
      // Get total customers
      const [totalUsersResult] = await pool.execute('SELECT COUNT(*) as totalUsers FROM users WHERE role = "customer"');
      const totalUsers = (totalUsersResult as any[])[0].totalUsers;

      // Get new customers in last 30 days
      const [newUsersResult] = await pool.execute(`
        SELECT COUNT(*) as newUsers 
        FROM users 
        WHERE role = "customer" AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `);
      const newUsers = (newUsersResult as any[])[0].newUsers;

      // Calculate growth rate (simplified)
      const growthRate = totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0;

      return {
        newCustomers: parseInt(newUsers),
        returningCustomers: totalUsers - newUsers,
        growthRate: parseFloat(growthRate.toFixed(2))
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
      const [totalOrdersResult] = await pool.execute('SELECT COUNT(*) as totalOrders FROM orders');
      const totalOrders = (totalOrdersResult as any[])[0].totalOrders;

      // Get returned orders
      const [returnedOrdersResult] = await pool.execute('SELECT COUNT(*) as returnedOrders FROM orders WHERE status = "RETURNED"');
      const returnedOrders = (returnedOrdersResult as any[])[0].returnedOrders;

      // Calculate return percentage
      const returnPercentage = totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;

      // Get refund amount
      const [refundResult] = await pool.execute(`
        SELECT COALESCE(SUM(refund_amount), 0) as refundAmount 
        FROM returns r
        JOIN orders o ON r.order_id = o.id
        WHERE o.status = "RETURNED"
      `);
      const refundAmount = (refundResult as any[])[0].refundAmount;

      return {
        returnPercentage: parseFloat(returnPercentage.toFixed(2)),
        refundAmount: parseFloat(refundAmount)
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        returnPercentage: 0,
        refundAmount: 0
      };
    }
  },

  async getAllOrders(): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT o.*, u.name as customer_name, u.email as customer_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);

      // Get order items for each order
      const ordersWithItems = await Promise.all((rows as any[]).map(async (order) => {
        const [items] = await pool.execute(`
          SELECT oi.*, p.title_en as product_title_en, p.title_hi as product_title_hi
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [order.id]);

        return {
          id: order.id,
          orderNumber: order.order_number,
          user: {
            name: order.customer_name,
            email: order.customer_email
          },
          totalAmount: parseFloat(order.total_amount),
          paymentStatus: order.payment_status,
          status: order.status,
          createdAt: order.created_at,
          items: (items as any[]).map(item => ({
            product: {
              title: { en: item.product_title_en, hi: item.product_title_hi }
            },
            quantity: item.quantity,
            price: parseFloat(item.price)
          }))
        };
      }));

      return ordersWithItems;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getRecentOrders(limit: number = 5): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT o.id, o.order_number, u.name as customerName, o.total_amount, o.status, o.created_at
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT ?
      `, [limit]);

      return (rows as any[]).map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        customer: {
          name: order.customerName
        },
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        createdAt: order.created_at
      }));
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getOrdersByUserId(userId: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT o.*, u.name as customer_name, u.email as customer_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [userId]);

      // Get order items for each order
      const ordersWithItems = await Promise.all((rows as any[]).map(async (order) => {
        const [items] = await pool.execute(`
          SELECT oi.*, p.title_en as product_title_en, p.title_hi as product_title_hi, p.id as product_id
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [order.id]);

        // Enhance items with product images
        const enhancedItems = await Promise.all((items as any[]).map(async (item) => {
          // Get product images
          const [images] = await pool.execute(
            'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC LIMIT 1',
            [item.product_id]
          );
          
          const productImage = (images as any[]).length > 0 ? (images as any[])[0].image_url : null;
          
          return {
            id: item.id,
            product_name: item.product_title_en,
            product_image: productImage,
            price: parseFloat(item.price),
            quantity: item.quantity,
            total: parseFloat(item.price) * item.quantity
          };
        }));

        return {
          id: order.id,
          order_number: order.order_number,
          user: {
            id: order.user_id,
            name: order.customer_name,
            email: order.customer_email
          },
          status: order.status,
          payment_status: order.payment_status,
          payment_method: order.payment_method,
          subtotal: parseFloat(order.subtotal),
          shipping_cost: parseFloat(order.shipping_cost),
          tax_amount: parseFloat(order.tax_amount),
          discount_amount: parseFloat(order.discount_amount),
          total_amount: parseFloat(order.total_amount),
          currency: order.currency,
          shipping_address: order.shipping_address,
          billing_address: order.billing_address,
          shipping_method: order.shipping_method,
          tracking_number: order.tracking_number,
          estimated_delivery: order.estimated_delivery,
          delivered_at: order.delivered_at,
          notes: order.notes,
          admin_notes: order.admin_notes,
          deliveryAgentName: order.delivery_agent_name,
          deliveryAgentPhone: order.delivery_agent_phone,
          created_at: order.created_at,
          updated_at: order.updated_at,
          items: enhancedItems
        };
      }));

      return ordersWithItems;
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async getOrderById(orderId: string): Promise<any | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT o.*, u.name as customer_name, u.email as customer_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId]);

      if ((rows as any[]).length === 0) return null;

      const order = (rows as any[])[0];
      
      // Get order items
      const [items] = await pool.execute(`
        SELECT oi.*, p.title_en as product_title_en, p.title_hi as product_title_hi, p.id as product_id
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderId]);

      // Enhance items with product images
      const enhancedItems = await Promise.all((items as any[]).map(async (item) => {
        // Get product images
        const [images] = await pool.execute(
          'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC LIMIT 1',
          [item.product_id]
        );
        
        const productImage = (images as any[]).length > 0 ? (images as any[])[0].image_url : null;
        
        return {
          id: item.id,
          product_name: item.product_title_en,
          product_image: productImage,
          price: parseFloat(item.price),
          quantity: item.quantity,
          total: parseFloat(item.price) * item.quantity
        };
      }));

      return {
        id: order.id,
        order_number: order.order_number,
        user: {
          id: order.user_id,
          name: order.customer_name,
          email: order.customer_email
        },
        status: order.status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        subtotal: parseFloat(order.subtotal),
        shipping_cost: parseFloat(order.shipping_cost),
        tax_amount: parseFloat(order.tax_amount),
        discount_amount: parseFloat(order.discount_amount),
        total_amount: parseFloat(order.total_amount),
        currency: order.currency,
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
        shipping_method: order.shipping_method,
        tracking_number: order.tracking_number,
        estimated_delivery: order.estimated_delivery,
        delivered_at: order.delivered_at,
        notes: order.notes,
        admin_notes: order.admin_notes,
        deliveryAgentName: order.delivery_agent_name,
        deliveryAgentPhone: order.delivery_agent_phone,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: enhancedItems
      };
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async createOrder(orderData: any): Promise<any> {
    try {
      // Create address if it doesn't exist
      let addressId;
      if (orderData.address) {
        // Check if address already exists
        const [existingAddress] = await pool.execute(
          `SELECT id FROM user_addresses 
           WHERE user_id = ? AND phone = ? AND address_line1 = ? AND city = ? AND state = ? AND pincode = ?`,
          [
            orderData.userId,
            orderData.address.phone,
            orderData.address.addressLine1,
            
            orderData.address.city,
            orderData.address.state,
            orderData.address.pincode
          ]
        );
        
        if ((existingAddress as any[]).length > 0) {
          addressId = (existingAddress as any[])[0].id;
        } else {
          // Create new address
          addressId = `addr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          await pool.execute(
            `INSERT INTO user_addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, address_type, is_default, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              addressId,
              orderData.userId,
              orderData.address.fullName,
              orderData.address.phone,
              orderData.address.addressLine1,
              orderData.address.addressLine2 || '',
              orderData.address.city,
              orderData.address.state,
              orderData.address.pincode,
              'India', // Default country
              'home', // Default address type
              0 // Not default
            ]
          );
        }
      }
      
      // Generate order number
      const orderNumber = orderData.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Format address as JSON for the database constraint
      const shippingAddressJson = orderData.address ? JSON.stringify({
        fullName: orderData.address.fullName,
        phone: orderData.address.phone,
        addressLine1: orderData.address.addressLine1,
        addressLine2: orderData.address.addressLine2 || '',
        city: orderData.address.city,
        state: orderData.address.state,
        pincode: orderData.address.pincode
      }) : '{}';
      
      const billingAddressJson = shippingAddressJson; // For now, use same as shipping
      
      // Create order
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const [result] = await pool.execute(
        `INSERT INTO orders (id, order_number, user_id, status, payment_status, payment_method, subtotal, shipping_cost, tax_amount, discount_amount, total_amount, currency, shipping_address, billing_address, shipping_method, estimated_delivery, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          orderId,
          orderNumber,
          orderData.userId,
          'pending', // Default status
          orderData.paymentMethod === 'cod' ? 'pending' : 'pending', // Default payment status
          orderData.paymentMethod,
          parseFloat(orderData.subtotal) || 0,
          parseFloat(orderData.shipping) || 0,
          0, // Tax amount (could be calculated)
          0, // Discount amount (could be applied)
          parseFloat(orderData.total) || 0,
          'INR', // Default currency
          shippingAddressJson,
          billingAddressJson,
          'Standard Shipping', // Default shipping method
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now (date only)
        ]
      );
      
      // Create order items
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          const orderItemId = `oi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          await pool.execute(
            `INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, total, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              orderItemId,
              orderId,
              item.product?.id || item.productId || item.productData?.id,
              item.product?.title?.en || item.product?.title?.hi || item.productData?.title?.en || item.productData?.title?.hi || item.productData?.name || 'Unknown Product',
              parseFloat(item.product?.price || item.price || item.productData?.price || 0),
              item.quantity || 1,
              parseFloat(item.product?.price || item.price || item.productData?.price || 0) * (item.quantity || 1)
            ]
          );
          
          // Update product stock
          await pool.execute(
            'UPDATE products SET stock = stock - ?, sales_count = sales_count + ? WHERE id = ?',
            [item.quantity || 1, item.quantity || 1, item.product?.id || item.productId || item.productData?.id]
          );
        }
      }
      
      // Return created order
      return {
        id: orderId,
        orderNumber: orderNumber,
        totalAmount: parseFloat(orderData.total) || 0
      };
    } catch (error) {
      console.error('Database error in createOrder:', error);
      throw error;
    }
  },

  async updateOrder(orderId: string, updateData: any): Promise<any | null> {
    try {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      
      if (updateData.status !== undefined) {
        fields.push('status = ?');
        values.push(updateData.status);
      }
      if (updateData.payment_status !== undefined) {
        fields.push('payment_status = ?');
        values.push(updateData.payment_status);
      }
      if (updateData.tracking_number !== undefined) {
        fields.push('tracking_number = ?');
        values.push(updateData.tracking_number);
      }
      if (updateData.shipping_method !== undefined) {
        fields.push('shipping_method = ?');
        values.push(updateData.shipping_method);
      }
      if (updateData.delivered_at !== undefined) {
        fields.push('delivered_at = ?');
        values.push(updateData.delivered_at);
      }
      if (updateData.admin_notes !== undefined) {
        fields.push('admin_notes = ?');
        values.push(updateData.admin_notes);
      }
      if (updateData.delivery_agent_name !== undefined) {
        fields.push('delivery_agent_name = ?');
        values.push(updateData.delivery_agent_name);
      }
      if (updateData.delivery_agent_phone !== undefined) {
        fields.push('delivery_agent_phone = ?');
        values.push(updateData.delivery_agent_phone);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = NOW()');
      
      if (fields.length === 0) return null;
      
      values.push(orderId);
      
      const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(query, values);
      
      if ((result as any).affectedRows === 0) return null;
      
      // Return updated order
      return await this.getOrderById(orderId);
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  },

  async getUserAddresses(userId: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
        [userId]
      );
      return rows as any[];
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async createUserAddress(userId: string, addressData: any): Promise<any> {
    try {
      const addressId = `addr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      await pool.execute(
        `INSERT INTO user_addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, address_type, is_default, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          addressId,
          userId,
          addressData.full_name,
          addressData.phone,
          addressData.address_line1,
          addressData.address_line2 || '',
          addressData.city,
          addressData.state,
          addressData.pincode,
          addressData.country || 'India',
          addressData.address_type || 'home',
          addressData.is_default ? 1 : 0
        ]
      );
      
      // Fetch the created address
      const [rows] = await pool.execute(
        'SELECT * FROM user_addresses WHERE id = ?',
        [addressId]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async createArtisan(artisanData: any): Promise<any> {
    try {
      const artisanId = `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const location = `${artisanData.village || ''}, ${artisanData.district || ''}, ${artisanData.state || ''}`;
      
      const [result] = await pool.execute(
        `INSERT INTO artisans (id, user_id, name, bio_en, bio_hi, specialization, location, phone, email, avatar, portfolio_images, social_links, experience_years, rating, total_products, is_verified, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          artisanId,
          null, // user_id
          artisanData.name,
          artisanData.bio?.en || '',
          artisanData.bio?.hi || '',
          artisanData.skills?.join(',') || '',
          location,
          artisanData.phone || '',
          artisanData.email || '',
          artisanData.photo || '',
          null, // portfolio_images
          null, // social_links
          artisanData.experience || 0,
          0, // rating
          0, // total_products
          0, // is_verified
          1 // is_active
        ]
      );
      
      // Fetch the created artisan
      const [rows] = await pool.execute(
        'SELECT * FROM artisans WHERE id = ?',
        [artisanId]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add updateArtisan method
  async updateArtisan(id: string, artisanData: any): Promise<any> {
    try {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      
      if (artisanData.name !== undefined) {
        fields.push('name = ?');
        values.push(artisanData.name);
      }
      if (artisanData.bio?.en !== undefined) {
        fields.push('bio_en = ?');
        values.push(artisanData.bio.en);
      }
      if (artisanData.bio?.hi !== undefined) {
        fields.push('bio_hi = ?');
        values.push(artisanData.bio.hi);
      }
      if (artisanData.skills !== undefined) {
        fields.push('specialization = ?');
        values.push(artisanData.skills?.join(',') || '');
      }
      if (artisanData.village !== undefined || artisanData.district !== undefined || artisanData.state !== undefined) {
        const location = `${artisanData.village || ''}, ${artisanData.district || ''}, ${artisanData.state || ''}`;
        fields.push('location = ?');
        values.push(location);
      }
      if (artisanData.photo !== undefined) {
        fields.push('avatar = ?');
        values.push(artisanData.photo);
      }
      if (artisanData.experience !== undefined) {
        fields.push('experience_years = ?');
        values.push(artisanData.experience);
      }
      if (artisanData.isActive !== undefined) {
        fields.push('is_active = ?');
        values.push(artisanData.isActive ? 1 : 0);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = NOW()');
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      const query = `UPDATE artisans SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(query, values);
      
      if ((result as any).affectedRows === 0) {
        throw new Error('Artisan not found');
      }
      
      // Fetch the updated artisan
      const [rows] = await pool.execute(
        'SELECT * FROM artisans WHERE id = ?',
        [id]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add deleteArtisan method
  async deleteArtisan(id: string): Promise<boolean> {
    try {
      // First check if artisan has products
      const [productCountResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM products WHERE artisan_id = ?',
        [id]
      );
      
      const productCount = (productCountResult as any[])[0].count;
      
      if (productCount > 0) {
        throw new Error('Cannot delete artisan with associated products. Please reassign products first.');
      }
      
      // Delete the artisan
      const [result] = await pool.execute(
        'DELETE FROM artisans WHERE id = ?',
        [id]
      );
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add createBanner method
  async createBanner(bannerData: any): Promise<any> {
    try {
      const bannerId = `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const [result] = await pool.execute(
        `INSERT INTO banners (id, title_en, title_hi, subtitle_en, subtitle_hi, description_en, description_hi, image_desktop, image_mobile, link_url, link_text_en, link_text_hi, display_order, is_active, start_date, end_date, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          bannerId,
          bannerData.title?.en || '',
          bannerData.title?.hi || '',
          bannerData.subtitle?.en || '',
          bannerData.subtitle?.hi || '',
          '', // description_en
          '', // description_hi
          bannerData.image || '',
          '', // image_mobile
          bannerData.link || '',
          bannerData.buttonText?.en || '',
          bannerData.buttonText?.hi || '',
          bannerData.sortOrder || 0,
          bannerData.isActive ? 1 : 0,
          bannerData.startDate || null,
          bannerData.endDate || null
        ]
      );
      
      // Fetch the created banner
      const [rows] = await pool.execute(
        'SELECT * FROM banners WHERE id = ?',
        [bannerId]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add updateBanner method
  async updateBanner(id: string, bannerData: any): Promise<any> {
    try {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      
      if (bannerData.title?.en !== undefined) {
        fields.push('title_en = ?');
        values.push(bannerData.title.en);
      }
      if (bannerData.title?.hi !== undefined) {
        fields.push('title_hi = ?');
        values.push(bannerData.title.hi);
      }
      if (bannerData.subtitle?.en !== undefined) {
        fields.push('subtitle_en = ?');
        values.push(bannerData.subtitle.en);
      }
      if (bannerData.subtitle?.hi !== undefined) {
        fields.push('subtitle_hi = ?');
        values.push(bannerData.subtitle.hi);
      }
      if (bannerData.image !== undefined) {
        fields.push('image_desktop = ?');
        values.push(bannerData.image);
      }
      if (bannerData.link !== undefined) {
        fields.push('link_url = ?');
        values.push(bannerData.link);
      }
      if (bannerData.buttonText?.en !== undefined) {
        fields.push('link_text_en = ?');
        values.push(bannerData.buttonText.en);
      }
      if (bannerData.buttonText?.hi !== undefined) {
        fields.push('link_text_hi = ?');
        values.push(bannerData.buttonText.hi);
      }
      if (bannerData.sortOrder !== undefined) {
        fields.push('display_order = ?');
        values.push(bannerData.sortOrder);
      }
      if (bannerData.isActive !== undefined) {
        fields.push('is_active = ?');
        values.push(bannerData.isActive ? 1 : 0);
      }
      if (bannerData.startDate !== undefined) {
        fields.push('start_date = ?');
        values.push(bannerData.startDate);
      }
      if (bannerData.endDate !== undefined) {
        fields.push('end_date = ?');
        values.push(bannerData.endDate);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = NOW()');
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      const query = `UPDATE banners SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(query, values);
      
      if ((result as any).affectedRows === 0) {
        throw new Error('Banner not found');
      }
      
      // Fetch the updated banner
      const [rows] = await pool.execute(
        'SELECT * FROM banners WHERE id = ?',
        [id]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
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
      throw error;
    }
  },
  
  // Add createCategory method
  async createCategory(categoryData: any): Promise<any> {
    try {
      const categoryId = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const [result] = await pool.execute(
        `INSERT INTO categories (id, name_en, name_hi, description_en, description_hi, image, parent_id, display_order, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          categoryId,
          categoryData.name?.en || '',
          categoryData.name?.hi || '',
          categoryData.description?.en || '',
          categoryData.description?.hi || '',
          categoryData.image || '',
          null, // parent_id
          categoryData.displayOrder || 0,
          categoryData.isActive ? 1 : 0
        ]
      );
      
      // Fetch the created category
      const [rows] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [categoryId]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add updateCategory method
  async updateCategory(id: string, categoryData: any): Promise<any> {
    try {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      
      if (categoryData.name?.en !== undefined) {
        fields.push('name_en = ?');
        values.push(categoryData.name.en);
      }
      if (categoryData.name?.hi !== undefined) {
        fields.push('name_hi = ?');
        values.push(categoryData.name.hi);
      }
      if (categoryData.description?.en !== undefined) {
        fields.push('description_en = ?');
        values.push(categoryData.description.en);
      }
      if (categoryData.description?.hi !== undefined) {
        fields.push('description_hi = ?');
        values.push(categoryData.description.hi);
      }
      if (categoryData.image !== undefined) {
        fields.push('image = ?');
        values.push(categoryData.image);
      }
      if (categoryData.slug !== undefined) {
        fields.push('slug = ?');
        values.push(categoryData.slug);
      }
      if (categoryData.featured !== undefined) {
        fields.push('featured = ?');
        values.push(categoryData.featured ? 1 : 0);
      }
      if (categoryData.isActive !== undefined) {
        fields.push('is_active = ?');
        values.push(categoryData.isActive ? 1 : 0);
      }
      if (categoryData.displayOrder !== undefined) {
        fields.push('display_order = ?');
        values.push(categoryData.displayOrder);
      }
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(query, values);
      
      if ((result as any).affectedRows === 0) {
        throw new Error('Category not found');
      }
      
      // Fetch the updated category
      const [rows] = await pool.execute(
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add deleteCategory method
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // First check if category has products
      const [productCountResult] = await pool.execute(
        'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
        [id]
      );
      
      const productCount = (productCountResult as any[])[0].count;
      
      if (productCount > 0) {
        throw new Error('Cannot delete category with associated products. Please reassign products first.');
      }
      
      // Delete the category
      const [result] = await pool.execute(
        'DELETE FROM categories WHERE id = ?',
        [id]
      );
      
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  // Add updateProduct method
  async updateProduct(id: string, productData: any): Promise<any> {
    try {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      
      if (productData.name?.en !== undefined) {
        fields.push('title_en = ?');
        values.push(productData.name.en);
      }
      if (productData.name?.hi !== undefined) {
        fields.push('title_hi = ?');
        values.push(productData.name.hi);
      }
      if (productData.description?.en !== undefined) {
        fields.push('description_en = ?');
        values.push(productData.description.en);
      }
      if (productData.description?.hi !== undefined) {
        fields.push('description_hi = ?');
        values.push(productData.description.hi);
      }
      if (productData.price !== undefined) {
        fields.push('price = ?');
        values.push(productData.price);
      }
      if (productData.originalPrice !== undefined) {
        fields.push('original_price = ?');
        values.push(productData.originalPrice);
      }
      if (productData.stock !== undefined) {
        fields.push('stock = ?');
        values.push(productData.stock);
      }
      if (productData.categoryId !== undefined) {
        fields.push('category_id = ?');
        values.push(productData.categoryId);
      }
      if (productData.artisanId !== undefined) {
        fields.push('artisan_id = ?');
        values.push(productData.artisanId);
      }
      if (productData.isActive !== undefined) {
        fields.push('is_active = ?');
        values.push(productData.isActive ? 1 : 0);
      }
      if (productData.featured !== undefined) {
        fields.push('featured = ?');
        values.push(productData.featured ? 1 : 0);
      }
      if (productData.bestSeller !== undefined) {
        fields.push('best_seller = ?');
        values.push(productData.bestSeller ? 1 : 0);
      }
      if (productData.newArrival !== undefined) {
        fields.push('new_arrival = ?');
        values.push(productData.newArrival ? 1 : 0);
      }
      if (productData.trending !== undefined) {
        fields.push('trending = ?');
        values.push(productData.trending ? 1 : 0);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = NOW()');
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(query, values);
      
      if ((result as any).affectedRows === 0) {
        throw new Error('Product not found');
      }
      
      // Fetch the updated product
      const [rows] = await pool.execute(
        'SELECT * FROM products WHERE id = ?',
        [id]
      );
      
      return (rows as any[])[0];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
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
      throw error;
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
  }

};