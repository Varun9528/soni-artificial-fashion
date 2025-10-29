// Database abstraction layer that works with Prisma (MySQL) or falls back to mock
import { mockDb } from './mock';

// Only use real database on server side
let usePrisma = false;

// Add a function to enable real database usage (should only be called on server side)
export const enableRealDatabase = () => {
  usePrisma = true;
};

// Add a function to check if we should use Prisma
const shouldUsePrisma = () => usePrisma;

// Database operations
export const db = {
  // User operations
  async findUserByEmail(email: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.findUserByEmail(email);
    }
    // Fallback to mock database
    return mockDb.findUserByEmail(email);
  },

  async findUserById(id: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.findUserById(id);
    }
    // Fallback to mock database
    return mockDb.findUserById(id);
  },

  async createUser(userData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createUser(userData);
    }
    // Fallback to mock database
    return mockDb.createUser(userData);
  },

  async updateUser(id: string, userData: any): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.updateUser(id, userData);
    }
    // Fallback to mock database
    return mockDb.updateUser(id, userData);
  },

  // Product operations
  async getProductBySlug(slug: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getProductBySlug(slug);
    }
    // Fallback to mock database
    return mockDb.getProductBySlug(slug);
  },

  async getProducts(filters: any): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getProducts(filters);
    }
    // Fallback to mock database
    return mockDb.getProducts(filters);
  },

  async searchProducts(searchParams: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.searchProducts(searchParams);
    }
    // Fallback to mock database
    return mockDb.searchProducts(searchParams);
  },

  async createProduct(productData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createProduct(productData);
    }
    // Fallback to mock database
    return mockDb.createProduct(productData);
  },

  // Cart operations
  async getCartItems(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getCartItems(userId);
    }
    // Fallback to mock database
    return mockDb.getCartItems(userId);
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.addToCart(userId, productId, quantity);
    }
    // Fallback to mock database
    return mockDb.addToCart(userId, productId, quantity);
  },

  async removeFromCart(userId: string, productId: string, variant?: any): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.removeFromCart(userId, productId, variant);
    }
    // Fallback to mock database
    return mockDb.removeFromCart(userId, productId);
  },

  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.updateCartItemQuantity(userId, productId, quantity);
    }
    // Fallback to mock database
    return mockDb.updateCartItemQuantity(userId, productId, quantity);
  },

  async clearCart(userId: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.clearCart(userId);
    }
    // Fallback to mock database
    return mockDb.clearCart(userId);
  },


  

  // Order operations
  async createOrder(orderData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createOrder(orderData);
    }
    // Fallback to mock database
    return mockDb.createOrder(orderData);
  },

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<any[]> {
    // Always use mock database for now
    return mockDb.getWishlistItems(userId);
  },

  async addToWishlist(userId: string, productId: string): Promise<any> {
    // Always use mock database for now
    return mockDb.addToWishlist(userId, productId);
  },

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    // Always use mock database for now
    return mockDb.removeFromWishlist(userId, productId);
  },
  
  // Admin operations
  async getAllProducts(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllProducts();
    }
    // Fallback to mock database
    return mockDb.getAllProducts();
  },
  
  async getAllCategories(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllCategories();
    }
    // Fallback to mock database
    return mockDb.getAllCategories();
  },
  
  async getAllArtisans(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllArtisans();
    }
    // Fallback to mock database
    return mockDb.getAllArtisans();
  },
  
  async getAllBanners(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllBanners();
    }
    // Fallback to mock database
    return mockDb.getAllBanners();
  },
  
  async getDashboardStats(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getDashboardStats();
    }
    // Fallback to mock database
    return mockDb.getDashboardStats();
  },
  
  async getTotalRevenue(): Promise<number> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getTotalRevenue();
    }
    // Fallback to mock database
    return mockDb.getTotalRevenue();
  },
  
  async getTotalOrders(): Promise<number> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getDashboardStats().then(stats => stats.totalOrders);
    }
    // Fallback to mock database
    return mockDb.getDashboardStats().then(stats => stats.totalOrders);
  },
  
  async getTotalUsers(): Promise<number> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getDashboardStats().then(stats => stats.totalUsers);
    }
    // Fallback to mock database
    return mockDb.getDashboardStats().then(stats => stats.totalUsers);
  },

  // Contact request operations
  async createContactRequest(contactData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createContactRequest(contactData);
    }
    // Fallback to mock database (not implemented in mock)
    throw new Error('Contact requests not supported in mock mode');
  },

  async getAllContactRequests(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllContactRequests();
    }
    // Fallback to mock database (not implemented in mock)
    return [];
  },

  // Sell request operations
  async createSellRequest(sellData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createSellRequest(sellData);
    }
    // Fallback to mock database (not implemented in mock)
    throw new Error('Sell requests not supported in mock mode');
  },

  async getAllSellRequests(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllSellRequests();
    }
    // Fallback to mock database (not implemented in mock)
    return [];
  },

  // Analytics operations
  async getSalesOverview(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getSalesOverview();
    }
    // Fallback to mock database
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      topSellingCategory: 'N/A'
    };
  },

  async getTopCategories(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getTopCategories();
    }
    // Fallback to mock database
    return [];
  },

  async getTopProducts(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getTopProducts();
    }
    // Fallback to mock database
    return [];
  },

  async getCustomerGrowth(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getCustomerGrowth();
    }
    // Fallback to mock database
    return {
      newCustomers: 0,
      returningCustomers: 0,
      growthRate: 0
    };
  },

  async getReturnsReport(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getReturnsReport();
    }
    // Fallback to mock database
    return {
      returnPercentage: 0,
      refundAmount: 0
    };
  },

  async getRecentOrders(limit: number = 5): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getRecentOrders(limit);
    }
    // Fallback to mock database
    return [];
  },

  async getAllOrders(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllOrders();
    }
    // Fallback to mock database
    return [];
  },

  async getOrdersByUserId(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getOrdersByUserId(userId);
    }
    // Fallback to mock database
    return [];
  },

  async getOrderById(orderId: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getOrderById(orderId);
    }
    // Fallback to mock database
    return null;
  },
  
  async updateOrder(orderId: string, updateData: any): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.updateOrder(orderId, updateData);
    }
    // Fallback to mock database
    return null;
  },
  
  async getUserAddresses(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getUserAddresses(userId);
    }
    // Fallback to mock database
    return [];
  },
  
  async createUserAddress(addressData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createUserAddress(addressData.user_id, addressData);
    }
    // Fallback to mock database
    return null;
  },
  
  async createArtisan(artisanData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createArtisan(artisanData);
    }
    // Fallback to mock database (not implemented in mock)
    return null;
  },
  
  // Add updateArtisan method
  async updateArtisan(id: string, artisanData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.updateArtisan(id, artisanData);
    }
    // Fallback to mock database
    return null;
  },
  
  // Add deleteArtisan method
  async deleteArtisan(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.deleteArtisan(id);
    }
    // Fallback to mock database
    return false;
  },
  
  async createBanner(bannerData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.createBanner(bannerData);
    }
    // Fallback to mock database (not implemented in mock)
    return null;
  },
  
  // Add updateBanner method
  async updateBanner(id: string, bannerData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.updateBanner(id, bannerData);
    }
    // Fallback to mock database
    return null;
  },
  
  // Add deleteBanner method
  async deleteBanner(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.deleteBanner(id);
    }
    // Fallback to mock database
    return false;
  },
  
  // Add updateCategory method
  async updateCategory(id: string, categoryData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.updateCategory(id, categoryData);
    }
    // Fallback to mock database
    return null;
  },
  
  // Add deleteCategory method
  async deleteCategory(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.deleteCategory(id);
    }
    // Fallback to mock database
    return false;
  },
  
  // Add updateProduct method
  async updateProduct(id: string, productData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.updateProduct(id, productData);
    }
    // Fallback to mock database
    return null;
  },
  
  // Add deleteProduct method
  async deleteProduct(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.deleteProduct(id);
    }
    // Fallback to mock database
    return false;
  },
  
  // Get all admin users
  async getAllAdminUsers(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return serverDb.getAllAdminUsers();
    }
    // Fallback to mock database
    return [];
  }
  
};