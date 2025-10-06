// Database abstraction layer that works with Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'manager' | 'support' | 'artisan' | 'customer';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// Database operations with Prisma
export const db = {
  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        password_hash: user.password,
        name: user.name,
        phone: user.phone || undefined,
        role: user.role as any,
        email_verified: user.emailVerified,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Database error in findUserByEmail:', error);
      throw error;
    }
  },

  async findUserById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        password_hash: user.password,
        name: user.name,
        phone: user.phone || undefined,
        role: user.role as any,
        email_verified: user.emailVerified,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Database error in findUserById:', error);
      throw error;
    }
  },

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: userData.password_hash,
          name: userData.name,
          phone: userData.phone,
          role: userData.role as any,
          emailVerified: userData.email_verified
        }
      });
      
      return {
        id: user.id,
        email: user.email,
        password_hash: user.password,
        name: user.name,
        phone: user.phone || undefined,
        role: user.role as any,
        email_verified: user.emailVerified,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Database error in createUser:', error);
      throw error;
    }
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id: id },
        data: {
          email: userData.email,
          password: userData.password_hash,
          name: userData.name,
          phone: userData.phone,
          role: userData.role as any,
          emailVerified: userData.email_verified
        }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        password_hash: user.password,
        name: user.name,
        phone: user.phone || undefined,
        role: user.role as any,
        email_verified: user.emailVerified,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString()
      };
    } catch (error) {
      console.error('Database error in updateUser:', error);
      throw error;
    }
  },

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: userId }
      });
      
      return cartItems.map(item => ({
        id: item.id,
        user_id: item.userId,
        product_id: item.productId,
        quantity: item.quantity,
        created_at: item.createdAt.toISOString()
      }));
    } catch (error) {
      console.error('Database error in getCartItems:', error);
      return [];
    }
  },

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    try {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId: userId,
          productId: productId
        }
      });
      
      if (existingItem) {
        // Update existing item
        const updatedItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        });
        
        return {
          id: updatedItem.id,
          user_id: updatedItem.userId,
          product_id: updatedItem.productId,
          quantity: updatedItem.quantity,
          created_at: updatedItem.createdAt.toISOString()
        };
      } else {
        // Create new item
        const newItem = await prisma.cartItem.create({
          data: {
            userId: userId,
            productId: productId,
            quantity: quantity
          }
        });
        
        return {
          id: newItem.id,
          user_id: newItem.userId,
          product_id: newItem.productId,
          quantity: newItem.quantity,
          created_at: newItem.createdAt.toISOString()
        };
      }
    } catch (error) {
      console.error('Database error in addToCart:', error);
      throw error;
    }
  },

  // Wishlist operations
  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    try {
      const wishlistItems = await prisma.wishlistItem.findMany({
        where: { userId: userId }
      });
      
      return wishlistItems.map(item => ({
        id: item.id,
        user_id: item.userId,
        product_id: item.productId,
        created_at: item.createdAt.toISOString()
      }));
    } catch (error) {
      console.error('Database error in getWishlistItems:', error);
      return [];
    }
  },

  async addToWishlist(userId: string, productId: string): Promise<WishlistItem> {
    try {
      const existingItem = await prisma.wishlistItem.findFirst({
        where: {
          userId: userId,
          productId: productId
        }
      });
      
      if (existingItem) {
        return {
          id: existingItem.id,
          user_id: existingItem.userId,
          product_id: existingItem.productId,
          created_at: existingItem.createdAt.toISOString()
        };
      }
      
      // Create new item
      const newItem = await prisma.wishlistItem.create({
        data: {
          userId: userId,
          productId: productId
        }
      });
      
      return {
        id: newItem.id,
        user_id: newItem.userId,
        product_id: newItem.productId,
        created_at: newItem.createdAt.toISOString()
      };
    } catch (error) {
      console.error('Database error in addToWishlist:', error);
      throw error;
    }
  },

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const existingItem = await prisma.wishlistItem.findFirst({
        where: {
          userId: userId,
          productId: productId
        }
      });
      
      if (existingItem) {
        await prisma.wishlistItem.delete({
          where: { id: existingItem.id }
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Database error in removeFromWishlist:', error);
      return false;
    }
  },
};