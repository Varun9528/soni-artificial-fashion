// Types for our marketplace data
export interface Product {
  id: string;
  slug: string;
  title: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  categoryId: string;
  artisanId: string;
  images: string[];
  variants?: {
    size?: string[];
    color?: string[];
  };
  material: string;
  dimensions: string;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  trending: boolean;
  newArrival: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  image: string;
  productCount: number;
}

export interface Artisan {
  id: string;
  slug: string;
  name: string;
  village: string;
  bio: {
    en: string;
    hi: string;
  };
  photo: string;
  specialization: string[];
  experience: number;
  totalProducts: number;
  rating: number;
  verified: boolean;
}

export interface Banner {
  id: string;
  title: {
    en: string;
    hi: string;
  };
  subtitle: {
    en: string;
    hi: string;
  };
  image: string;
  link: string;
  active: boolean;
  order: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  wallet: number;
  rewards: number;
  preferences: {
    language: 'en' | 'hi';
    theme: 'light' | 'dark';
  };
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface CompareItem {
  productId: string;
  addedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  usageLimit: number;
  usedCount: number;
}