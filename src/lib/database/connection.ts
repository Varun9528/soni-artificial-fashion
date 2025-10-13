// Database abstraction layer that works with Prisma (MySQL) or falls back to mock
import { mockDb } from './mock';

// Try to import Prisma
let prisma: any = null;
let usePrisma = false;

// Initialize Prisma connection synchronously
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  usePrisma = true;
  console.log('Prisma client initialized');
} catch (error: any) {
  console.log('Prisma not available, using mock database:', error.message);
  usePrisma = false;
}

// Add a function to check if we should use Prisma
const shouldUsePrisma = () => usePrisma && prisma;

// Database operations
export const db = {
  // User operations
  async findUserByEmail(email: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email }
        });
        
        if (!user) return null;
        
        return {
          id: user.id,
          email: user.email,
          password_hash: user.password_hash,
          name: user.name,
          phone: user.phone || undefined,
          role: user.role?.toLowerCase() as any,
          email_verified: user.email_verified,
          created_at: user.created_at?.toISOString(),
          updated_at: user.updated_at?.toISOString()
        };
      } catch (error) {
        console.error('Database error in findUserByEmail:', error);
        // Fall back to mock
        return mockDb.findUserByEmail(email);
      }
    } else {
      return mockDb.findUserByEmail(email);
    }
  },

  async findUserById(id: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: id }
        });
        
        if (!user) return null;
        
        return {
          id: user.id,
          email: user.email,
          password_hash: user.password_hash,
          name: user.name,
          phone: user.phone || undefined,
          role: user.role?.toLowerCase() as any,
          email_verified: user.email_verified,
          created_at: user.created_at?.toISOString(),
          updated_at: user.updated_at?.toISOString()
        };
      } catch (error) {
        console.error('Database error in findUserById:', error);
        // Fall back to mock
        return mockDb.findUserById(id);
      }
    } else {
      return mockDb.findUserById(id);
    }
  },

  async createUser(userData: any): Promise<any> {
    if (shouldUsePrisma()) {
      try {
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            password_hash: userData.password_hash,
            name: userData.name,
            phone: userData.phone,
            role: userData.role as any,
            email_verified: userData.email_verified
          }
        });
        
        return {
          id: user.id,
          email: user.email,
          password_hash: user.password_hash,
          name: user.name,
          phone: user.phone || undefined,
          role: user.role?.toLowerCase() as any,
          email_verified: user.email_verified,
          created_at: user.created_at?.toISOString(),
          updated_at: user.updated_at?.toISOString()
        };
      } catch (error) {
        console.error('Database error in createUser:', error);
        // Fall back to mock
        return mockDb.createUser(userData);
      }
    } else {
      return mockDb.createUser(userData);
    }
  },

  async updateUser(id: string, userData: any): Promise<any | null> {
    if (shouldUsePrisma()) {
      try {
        const user = await prisma.user.update({
          where: { id: id },
          data: {
            email: userData.email,
            password_hash: userData.password_hash,
            name: userData.name,
            phone: userData.phone,
            role: userData.role as any,
            email_verified: userData.email_verified
          }
        });
        
        if (!user) return null;
        
        return {
          id: user.id,
          email: user.email,
          password_hash: user.password_hash,
          name: user.name,
          phone: user.phone || undefined,
          role: user.role?.toLowerCase() as any,
          email_verified: user.email_verified,
          created_at: user.created_at?.toISOString(),
          updated_at: user.updated_at?.toISOString()
        };
      } catch (error) {
        console.error('Database error in updateUser:', error);
        // Fall back to mock
        return mockDb.updateUser(id, userData);
      }
    } else {
      return mockDb.updateUser(id, userData);
    }
  },

  // Product operations
  async getProductBySlug(slug: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      try {
        const product = await prisma.product.findUnique({
          where: { slug: slug }
        });
        
        if (!product) return null;
        
        // Handle the title field conversion
        const title = {
          en: product.title_en || '',
          hi: product.title_hi || ''
        };
        
        // Handle the description field conversion
        const description = {
          en: product.description_en || '',
          hi: product.description_hi || ''
        };
        
        // Get product images
        const productImages = await prisma.productImage.findMany({
          where: { product_id: product.id }
        });
        
        // Get category
        const category = product.category_id ? await prisma.category.findUnique({
          where: { id: product.category_id }
        }) : null;
        
        // Get artisan
        const artisan = product.artisan_id ? await prisma.artisan.findUnique({
          where: { id: product.artisan_id }
        }) : null;
        
        return {
          id: product.id,
          slug: product.slug,
          title: title,
          description: description,
          price: parseFloat(product.price.toString()),
          originalPrice: product.original_price ? parseFloat(product.original_price.toString()) : null,
          stock: product.stock || 0,
          rating: product.rating ? parseFloat(product.rating.toString()) : 0,
          reviewCount: product.review_count || 0,
          categoryId: product.category_id,
          artisanId: product.artisan_id,
          images: productImages.map((img: any) => img.image_url),
          featured: product.featured || false,
          bestSeller: product.best_seller || false,
          isActive: product.is_active || false,
          createdAt: product.created_at?.toISOString(),
          productImages: productImages.map((img: any) => ({
            url: img.image_url,
            isPrimary: img.is_primary || false
          })),
          category: category ? {
            id: category.id,
            name: {
              en: category.name_en,
              hi: category.name_hi
            },
            description: {
              en: category.description_en,
              hi: category.description_hi
            }
          } : null,
          artisan: artisan ? {
            id: artisan.id,
            name: artisan.name,
            bio: {
              en: artisan.bio_en,
              hi: artisan.bio_hi
            },
            specialization: artisan.specialization,
            location: artisan.location
          } : null
        };
      } catch (error) {
        console.error('Database error in getProductBySlug:', error);
        // Fall back to mock
        return mockDb.getProductBySlug(slug);
      }
    } else {
      return mockDb.getProductBySlug(slug);
    }
  },

  async getProducts(filters: any): Promise<any[]> {
    if (shouldUsePrisma()) {
      try {
        // Build where clause
        const where: any = {};
        
        if (filters.category) {
          where.category_id = filters.category;
        }
        
        if (filters.featured) {
          where.featured = true;
        }
        
        if (filters.bestSeller) {
          where.best_seller = true;
        }
        
        if (filters.newArrival) {
          // For new arrivals, we'll use created_at sorting instead
          // This field doesn't exist in the actual schema, so we'll skip this filter
        }
        
        // Get products
        const products = await prisma.product.findMany({
          where,
          take: filters.limit || 8
        });
        
        // Process products to add related data
        const processedProducts = await Promise.all(products.map(async (product: any) => {
          // Handle the title field conversion
          const title = {
            en: product.title_en || '',
            hi: product.title_hi || ''
          };
          
          // Handle the description field conversion
          const description = {
            en: product.description_en || '',
            hi: product.description_hi || ''
          };
          
          // Get product images
          const productImages = await prisma.productImage.findMany({
            where: { product_id: product.id }
          });
          
          // Get category
          const category = product.category_id ? await prisma.category.findUnique({
            where: { id: product.category_id }
          }) : null;
          
          // Get artisan
          const artisan = product.artisan_id ? await prisma.artisan.findUnique({
            where: { id: product.artisan_id }
          }) : null;
          
          return {
            id: product.id,
            slug: product.slug,
            title: title,
            description: description,
            price: parseFloat(product.price.toString()),
            originalPrice: product.original_price ? parseFloat(product.original_price.toString()) : null,
            stock: product.stock || 0,
            rating: product.rating ? parseFloat(product.rating.toString()) : 0,
            reviewCount: product.review_count || 0,
            categoryId: product.category_id,
            artisanId: product.artisan_id,
            images: productImages.map((img: any) => img.image_url),
            featured: product.featured || false,
            bestSeller: product.best_seller || false,
            isActive: product.is_active || false,
            createdAt: product.created_at?.toISOString(),
            category: category ? {
              id: category.id,
              name: {
                en: category.name_en,
                hi: category.name_hi
              }
            } : null,
            artisan: artisan ? {
              id: artisan.id,
              name: artisan.name
            } : null
          };
        }));
        
        return processedProducts;
      } catch (error) {
        console.error('Database error in getProducts:', error);
        // Fall back to mock
        return mockDb.getProducts(filters);
      }
    } else {
      return mockDb.getProducts(filters);
    }
  },

  async searchProducts(searchParams: any): Promise<any> {
    if (shouldUsePrisma()) {
      try {
        // Build where clause
        const where: any = {};
        
        // Search filter
        if (searchParams.query) {
          where.OR = [
            { title_en: { contains: searchParams.query, mode: 'insensitive' } },
            { title_hi: { contains: searchParams.query, mode: 'insensitive' } },
            { description_en: { contains: searchParams.query, mode: 'insensitive' } },
            { description_hi: { contains: searchParams.query, mode: 'insensitive' } }
          ];
        }
        
        // Category filter
        if (searchParams.category && searchParams.category !== 'all') {
          where.category_id = searchParams.category;
        }
        
        // Price filter
        if (searchParams.minPrice || searchParams.maxPrice) {
          where.price = {};
          if (searchParams.minPrice) {
            where.price.gte = searchParams.minPrice;
          }
          if (searchParams.maxPrice) {
            where.price.lte = searchParams.maxPrice;
          }
        }
        
        // Build orderBy clause
        let orderBy: any = {};
        switch (searchParams.sortBy) {
          case 'price_low_high':
            orderBy = { price: 'asc' };
            break;
          case 'price_high_low':
            orderBy = { price: 'desc' };
            break;
          case 'rating':
            orderBy = { rating: 'desc' };
            break;
          case 'newest':
            orderBy = { created_at: 'desc' };
            break;
          case 'name':
            orderBy = { title_en: 'asc' };
            break;
          default: // relevance
            orderBy = { created_at: 'desc' };
        }
        
        // Get total count
        const totalCount = await prisma.product.count({ where });
        
        // Get products with pagination
        const products = await prisma.product.findMany({
          where,
          orderBy,
          skip: (searchParams.page - 1) * searchParams.limit,
          take: searchParams.limit
        });
        
        // Process products to add related data
        const processedProducts = await Promise.all(products.map(async (product: any) => {
          // Handle the title field conversion
          const title = {
            en: product.title_en || '',
            hi: product.title_hi || ''
          };
          
          // Handle the description field conversion
          const description = {
            en: product.description_en || '',
            hi: product.description_hi || ''
          };
          
          // Get product images
          const productImages = await prisma.productImage.findMany({
            where: { product_id: product.id }
          });
          
          // Get category
          const category = product.category_id ? await prisma.category.findUnique({
            where: { id: product.category_id }
          }) : null;
          
          return {
            id: product.id,
            slug: product.slug,
            title: title,
            description: description,
            price: parseFloat(product.price.toString()),
            originalPrice: product.original_price ? parseFloat(product.original_price.toString()) : null,
            stock: product.stock || 0,
            inStock: (product.stock || 0) > 0,
            featured: product.featured || false,
            bestSeller: product.best_seller || false,
            isActive: product.is_active || false,
            rating: product.rating ? parseFloat(product.rating.toString()) : 0,
            reviewCount: product.review_count || 0,
            images: productImages.map((img: any) => img.image_url),
            category: category ? {
              id: category.id,
              name: {
                en: category.name_en,
                hi: category.name_hi
              }
            } : null,
            tags: product.tags ? product.tags.split(',') : [],
            materials: product.material ? [product.material] : [],
            createdAt: product.created_at?.toISOString()
          };
        }));
        
        return {
          products: processedProducts,
          pagination: {
            currentPage: searchParams.page,
            totalPages: Math.ceil(totalCount / searchParams.limit),
            totalProducts: totalCount,
            hasNextPage: searchParams.page * searchParams.limit < totalCount,
            hasPrevPage: searchParams.page > 1
          }
        };
      } catch (error) {
        console.error('Database error in searchProducts:', error);
        // Fall back to mock
        return mockDb.searchProducts(searchParams);
      }
    } else {
      return mockDb.searchProducts(searchParams);
    }
  },

  // Cart operations
  async getCartItems(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      try {
        // Note: Actual cart implementation would need to be added
        return [];
      } catch (error) {
        console.error('Database error in getCartItems:', error);
        return [];
      }
    } else {
      return mockDb.getCartItems(userId);
    }
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<any> {
    if (shouldUsePrisma()) {
      try {
        // Note: Actual cart implementation would need to be added
        return { id: 'mock', user_id: userId, product_id: productId, quantity };
      } catch (error) {
        console.error('Database error in addToCart:', error);
        // Fall back to mock
        return mockDb.addToCart(userId, productId, quantity);
      }
    } else {
      return mockDb.addToCart(userId, productId, quantity);
    }
  },

  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      try {
        // Note: Actual cart implementation would need to be added
        return true;
      } catch (error) {
        console.error('Database error in removeFromCart:', error);
        // Fall back to mock
        return mockDb.removeFromCart(userId, productId);
      }
    } else {
      return mockDb.removeFromCart(userId, productId);
    }
  },

  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<boolean> {
    if (shouldUsePrisma()) {
      try {
        // Note: Actual cart implementation would need to be added
        return true;
      } catch (error) {
        console.error('Database error in updateCartItemQuantity:', error);
        // Fall back to mock
        return mockDb.updateCartItemQuantity(userId, productId, quantity);
      }
    } else {
      return mockDb.updateCartItemQuantity(userId, productId, quantity);
    }
  },

  async clearCart(userId: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      try {
        await prisma.cart.deleteMany({
          where: { user_id: userId }
        });
        return true;
      } catch (error) {
        console.error('Database error in clearCart:', error);
        // Fall back to mock
        return mockDb.clearCart(userId);
      }
    } else {
      return mockDb.clearCart(userId);
    }
  },

  // Order operations
  async createOrder(orderData: any): Promise<any> {
    if (shouldUsePrisma()) {
      try {
        // Create the order
        const order = await prisma.order.create({
          data: {
            order_number: orderData.orderNumber,
            user_id: orderData.userId,
            status: 'pending',
            payment_status: 'pending',
            payment_method: orderData.paymentMethod,
            subtotal: orderData.subtotal,
            shipping_cost: orderData.shipping,
            tax_amount: orderData.tax,
            total_amount: orderData.total,
            shipping_address: JSON.stringify(orderData.address),
            created_at: new Date(),
            updated_at: new Date()
          }
        });
        
        // Create order items
        if (orderData.items && Array.isArray(orderData.items)) {
          for (const item of orderData.items) {
            // Get product info
            const product = await prisma.product.findUnique({
              where: { id: item.productId }
            });
            
            if (product) {
              await prisma.orderItem.create({
                data: {
                  order_id: order.id,
                  product_id: item.productId,
                  product_name: product.title_en,
                  price: product.price,
                  quantity: item.quantity,
                  total: product.price * item.quantity,
                  created_at: new Date()
                }
              });
              
              // Update product stock
              await prisma.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: item.quantity
                  }
                }
              });
            }
          }
        }
        
        return {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: order.total_amount
        };
      } catch (error) {
        console.error('Database error in createOrder:', error);
        // Fall back to mock
        return mockDb.createOrder(orderData);
      }
    } else {
      return mockDb.createOrder(orderData);
    }
  },

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      try {
        // Note: Actual wishlist implementation would need to be added
        return [];
      } catch (error) {
        console.error('Database error in getWishlistItems:', error);
        return [];
      }
    } else {
      return mockDb.getWishlistItems(userId);
    }
  },

  async addToWishlist(userId: string, productId: string): Promise<any> {
    if (shouldUsePrisma()) {
      try {
        // Note: Actual wishlist implementation would need to be added
        return { id: 'mock', user_id: userId, product_id: productId };
      } catch (error) {
        console.error('Database error in addToWishlist:', error);
        // Fall back to mock
        return mockDb.addToWishlist(userId, productId);
      }
    } else {
      return mockDb.addToWishlist(userId, productId);
    }
  },

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      try {
        // Note: Actual wishlist implementation would need to be added
        return true;
      } catch (error) {
        console.error('Database error in removeFromWishlist:', error);
        // Fall back to mock
        return mockDb.removeFromWishlist(userId, productId);
      }
    } else {
      return mockDb.removeFromWishlist(userId, productId);
    }
  },
  
  // Admin operations
  async getAllProducts(): Promise<any[]> {
    if (shouldUsePrisma()) {
      try {
        const products = await prisma.product.findMany();
        
        // Process products to add related data
        const processedProducts = await Promise.all(products.map(async (product: any) => {
          // Handle the title field conversion
          const title = {
            en: product.title_en || '',
            hi: product.title_hi || ''
          };
          
          // Handle the description field conversion
          const description = {
            en: product.description_en || '',
            hi: product.description_hi || ''
          };
          
          // Get product images
          const productImages = await prisma.productImage.findMany({
            where: { product_id: product.id }
          });
          
          return {
            id: product.id,
            slug: product.slug,
            title: title,
            description: description,
            price: parseFloat(product.price.toString()),
            originalPrice: product.original_price ? parseFloat(product.original_price.toString()) : null,
            stock: product.stock || 0,
            categoryId: product.category_id,
            artisanId: product.artisan_id,
            featured: product.featured || false,
            bestSeller: product.best_seller || false,
            isActive: product.is_active || false,
            productImages: productImages.map((img: any) => ({
              url: img.image_url,
              isPrimary: img.is_primary || false
            })),
            createdAt: product.created_at?.toISOString()
          };
        }));
        
        return processedProducts;
      } catch (error) {
        console.error('Database error in getAllProducts:', error);
        return [];
      }
    } else {
      return [];
    }
  },
  
  async getAllCategories(): Promise<any[]> {
    if (shouldUsePrisma()) {
      try {
        const categories = await prisma.category.findMany();
        
        return categories.map((category: any) => ({
          id: category.id,
          name: {
            en: category.name_en,
            hi: category.name_hi
          },
          description: {
            en: category.description_en,
            hi: category.description_hi
          },
          image: category.image,
          isActive: category.is_active,
          createdAt: category.created_at?.toISOString()
        }));
      } catch (error) {
        console.error('Database error in getAllCategories:', error);
        return [];
      }
    } else {
      return [];
    }
  },
  
  async getAllArtisans(): Promise<any[]> {
    if (shouldUsePrisma()) {
      try {
        const artisans = await prisma.artisan.findMany();
        
        return artisans.map((artisan: any) => ({
          id: artisan.id,
          name: artisan.name,
          bio: {
            en: artisan.bio_en,
            hi: artisan.bio_hi
          },
          specialization: artisan.specialization,
          location: artisan.location,
          phone: artisan.phone,
          email: artisan.email,
          avatar: artisan.avatar,
          experienceYears: artisan.experience_years,
          rating: artisan.rating ? parseFloat(artisan.rating.toString()) : 0,
          totalProducts: artisan.total_products || 0,
          isVerified: artisan.is_verified || false,
          isActive: artisan.is_active || false,
          createdAt: artisan.created_at?.toISOString()
        }));
      } catch (error) {
        console.error('Database error in getAllArtisans:', error);
        return [];
      }
    } else {
      return [];
    }
  },
  
  async getAllBanners(): Promise<any[]> {
    if (shouldUsePrisma()) {
      try {
        const banners = await prisma.banner.findMany({
          orderBy: { display_order: 'asc' }
        });
        
        return banners.map((banner: any) => ({
          id: banner.id,
          title: {
            en: banner.title_en,
            hi: banner.title_hi
          },
          subtitle: {
            en: banner.subtitle_en,
            hi: banner.subtitle_hi
          },
          description: {
            en: banner.description_en,
            hi: banner.description_hi
          },
          imageDesktop: banner.image_desktop,
          imageMobile: banner.image_mobile,
          linkUrl: banner.link_url,
          linkText: {
            en: banner.link_text_en,
            hi: banner.link_text_hi
          },
          backgroundColor: banner.background_color,
          textColor: banner.text_color,
          buttonColor: banner.button_color,
          displayOrder: banner.display_order,
          isActive: banner.is_active,
          startDate: banner.start_date?.toISOString(),
          endDate: banner.end_date?.toISOString(),
          createdAt: banner.created_at?.toISOString()
        }));
      } catch (error) {
        console.error('Database error in getAllBanners:', error);
        return [];
      }
    } else {
      return [];
    }
  },
  
  async getDashboardStats(): Promise<any> {
    if (shouldUsePrisma()) {
      try {
        const [totalProducts, totalOrders, totalUsers, totalArtisans] = await Promise.all([
          prisma.product.count(),
          prisma.order.count(),
          prisma.user.count(),
          prisma.artisan.count()
        ]);
        
        return {
          totalProducts,
          totalOrders,
          totalUsers,
          totalArtisans
        };
      } catch (error) {
        console.error('Database error in getDashboardStats:', error);
        return {
          totalProducts: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalArtisans: 0
        };
      }
    } else {
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalArtisans: 0
      };
    }
  }
};