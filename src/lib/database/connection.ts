// Database abstraction layer that works with Prisma (MySQL) or falls back to mock
import mockDb from './mock';

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
      return (serverDb as any).createOrder(orderData);
    }
    // Fallback to mock database
    return mockDb.createOrder(orderData);
  },

  async getOrderById(orderId: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getOrderById(orderId);
    }
    // Fallback to mock database
    return mockDb.getOrderById(orderId);
  },

  async getOrdersByUserId(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getOrdersByUserId(userId);
    }
    // Fallback to mock database
    return mockDb.getOrdersByUserId(userId);
  },

  // Admin operations
  async getAllProducts(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllProducts();
    }
    // Fallback to mock database
    return mockDb.getAllProducts();
  },
  
  async getAllCategories(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllCategories();
    }
    // Fallback to mock database
    return mockDb.getAllCategories();
  },
  
  async getAllArtisans(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllArtisans();
    }
    // Fallback to mock database
    return mockDb.getAllArtisans();
  },
  
  async getAllBanners(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllBanners();
    }
    // Fallback to mock database
    return mockDb.getAllBanners();
  },
  
  // Wishlist operations
  async getWishlistItems(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getWishlistItems(userId);
    }
    // Fallback to mock database
    return mockDb.getWishlistItems(userId);
  },

  async addToWishlist(userId: string, productId: string): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).addToWishlist(userId, productId);
    }
    // Fallback to mock database
    return mockDb.addToWishlist(userId, productId);
  },

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).removeFromWishlist(userId, productId);
    }
    // Fallback to mock database
    return mockDb.removeFromWishlist(userId, productId);
  },
  
  async clearWishlist(userId: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).clearWishlist(userId);
    }
    // Fallback to mock database
    return mockDb.clearWishlist(userId);
  },
  
  // Analytics operations
  async getCustomerGrowth(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getCustomerGrowth();
    }
    // Fallback to mock database
    return (mockDb as any).getCustomerGrowth();
  },
  
  async getRecentOrders(limit: number = 5): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getRecentOrders(limit);
    }
    // Fallback to mock database
    return (mockDb as any).getRecentOrders(limit);
  },
  
  async getReturnsReport(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getReturnsReport();
    }
    // Fallback to mock database
    return (mockDb as any).getReturnsReport();
  },
  
  async getSalesOverview(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getSalesOverview();
    }
    // Fallback to mock database
    return (mockDb as any).getSalesOverview();
  },
  
  async getTopCategories(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getTopCategories();
    }
    // Fallback to mock database
    return (mockDb as any).getTopCategories();
  },
  
  async getTopProducts(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getTopProducts();
    }
    // Fallback to mock database
    return (mockDb as any).getTopProducts();
  },
  
  async updateArtisan(id: string, artisanData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).updateArtisan(id, artisanData);
    }
    // Fallback to mock database
    return (mockDb as any).updateArtisan(id, artisanData);
  },
  
  async deleteArtisan(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).deleteArtisan(id);
    }
    // Fallback to mock database
    return (mockDb as any).deleteArtisan(id);
  },
  
  async createArtisan(artisanData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).createArtisan(artisanData);
    }
    // Fallback to mock database
    return (mockDb as any).createArtisan(artisanData);
  },
  
  async getAllAdminUsers(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllAdminUsers();
    }
    // Fallback to mock database
    return (mockDb as any).getAllAdminUsers();
  },
  
  async updateOrder(orderId: string, updateData: any): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).updateOrder(orderId, updateData);
    }
    // Fallback to mock database
    return (mockDb as any).updateOrder(orderId, updateData);
  },
  
  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).updateOrderStatus(orderId, status);
    }
    // Fallback to mock database
    return (mockDb as any).updateOrderStatus(orderId, status);
  },
  
  // Add missing banner functions
  async createBanner(bannerData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).createBanner(bannerData);
    }
    // Fallback to mock database
    return (mockDb as any).createBanner(bannerData);
  },
  
  async updateBanner(id: string, bannerData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).updateBanner(id, bannerData);
    }
    // Fallback to mock database
    return (mockDb as any).updateBanner(id, bannerData);
  },
  
  async deleteBanner(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).deleteBanner(id);
    }
    // Fallback to mock database
    return (mockDb as any).deleteBanner(id);
  },
  
  // Add missing product functions
  async updateProduct(id: string, productData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).updateProduct(id, productData);
    }
    // Fallback to mock database
    return (mockDb as any).updateProduct(id, productData);
  },
  
  async deleteProduct(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).deleteProduct(id);
    }
    // Fallback to mock database
    return (mockDb as any).deleteProduct(id);
  },
  
  // Add missing category functions
  async createCategory(categoryData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).createCategory(categoryData);
    }
    // Fallback to mock database
    return (mockDb as any).createCategory(categoryData);
  },
  
  async updateCategory(id: string, categoryData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).updateCategory(id, categoryData);
    }
    // Fallback to mock database
    return (mockDb as any).updateCategory(id, categoryData);
  },
  
  async deleteCategory(id: string): Promise<boolean> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).deleteCategory(id);
    }
    // Fallback to mock database
    return (mockDb as any).deleteCategory(id);
  },
  
  async getCategoryById(id: string): Promise<any | null> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getCategoryById(id);
    }
    // Fallback to mock database
    return (mockDb as any).getCategoryById(id);
  },
  
  async getTotalOrders(): Promise<number> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getTotalOrders();
    }
    // Fallback to mock database
    return 0;
  },
  
  async getTotalUsers(): Promise<number> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getTotalUsers();
    }
    // Fallback to mock database
    return 0;
  },
  
  async getTotalRevenue(): Promise<number> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getTotalRevenue();
    }
    // Fallback to mock database
    return 0;
  },
  
  async getAllOrders(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllOrders();
    }
    // Fallback to mock database
    return [];
  },
  
  async createContactRequest(contactData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).createContactRequest(contactData);
    }
    // Fallback to mock database
    return null;
  },
  
  async getAllContactRequests(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllContactRequests();
    }
    // Fallback to mock database
    return [];
  },
  
  async getDashboardStats(): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getDashboardStats();
    }
    // Fallback to mock database
    return {};
  },
  
  async createSellRequest(sellData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).createSellRequest(sellData);
    }
    // Fallback to mock database
    return null;
  },
  
  async getAllSellRequests(): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getAllSellRequests();
    }
    // Fallback to mock database
    return [];
  },
  
  async getUserAddresses(userId: string): Promise<any[]> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).getUserAddresses(userId);
    }
    // Fallback to mock database
    return [];
  },
  
  async createUserAddress(userId: string, addressData: any): Promise<any> {
    if (shouldUsePrisma()) {
      // Dynamically import server-side database operations
      const { serverDb } = await import('./server-db');
      return (serverDb as any).createUserAddress(userId, addressData);
    }
    // Fallback to mock database
    return null;
  }
  
};