# Technical Implementation Roadmap

This document outlines the technical steps and considerations needed to implement the remaining production-ready features for the Pachmarhi Tribal Art Marketplace.

## Phase 1: Authentication & Security Enhancement

### JWT Token Management
```javascript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback_refresh_secret';

export const generateTokens = (user: any) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  cookies().set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60,
    path: '/',
  });
  
  cookies().set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
};
```

### Secure Authentication Middleware
```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  
  // Protected routes
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
```

## Phase 2: Payment Integration

### Razorpay Integration
```javascript
// lib/payment/razorpay.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (amount: number, currency: string = 'INR') => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw error;
  }
};

export const verifyPayment = async (orderId: string, paymentId: string, signature: string) => {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(orderId + '|' + paymentId)
      .digest('hex');
      
    return expectedSignature === signature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};
```

### Stripe Integration
```javascript
// lib/payment/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (amount: number, currency: string = 'inr') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw error;
  }
};
```

## Phase 3: Seller/Artisan Module

### Seller Registration Schema
```prisma
// prisma/schema.prisma
model Seller {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  businessName  String
  gstNumber     String?
  address       String
  phone         String
  email         String
  verified      Boolean    @default(false)
  documents     Json?
  products      Product[]
  orders        Order[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt()
}
```

### Seller Dashboard API Routes
```javascript
// src/app/api/seller/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'seller') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch seller data and related information
    const sellerData = await prisma.seller.findUnique({
      where: { id: params.id },
      include: {
        products: true,
        orders: {
          include: {
            items: true,
            user: true,
          },
        },
      },
    });
    
    return NextResponse.json(sellerData);
  } catch (error) {
    console.error('Seller dashboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Phase 4: Advanced Search Implementation

### Search Service
```javascript
// lib/search/searchService.ts
interface SearchFilters {
  query?: string;
  categoryId?: string;
  artisanId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'popularity' | 'newest';
}

export const searchProducts = async (filters: SearchFilters) => {
  try {
    const whereClause: any = {};
    
    if (filters.query) {
      whereClause.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ];
    }
    
    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }
    
    if (filters.artisanId) {
      whereClause.artisanId = filters.artisanId;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      whereClause.price = {};
      if (filters.minPrice) whereClause.price.gte = filters.minPrice;
      if (filters.maxPrice) whereClause.price.lte = filters.maxPrice;
    }
    
    if (filters.inStock !== undefined) {
      whereClause.inStock = filters.inStock;
    }
    
    const orderBy: any = {};
    switch (filters.sortBy) {
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'popularity':
        orderBy.rating = 'desc';
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }
    
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      include: {
        category: true,
        artisan: true,
      },
    });
    
    return products;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};
```

## Phase 5: Notification System

### Notification Service
```javascript
// lib/notifications/notificationService.ts
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system';
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
    try {
      const newNotification = await prisma.notification.create({
        data: {
          ...notification,
          read: false,
          createdAt: new Date(),
        },
      });
      
      // Send real-time notification if using WebSocket
      // await this.sendRealTimeNotification(newNotification);
      
      return newNotification;
    } catch (error) {
      console.error('Notification creation error:', error);
      throw error;
    }
  }
  
  static async getUserNotifications(userId: string) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      
      return notifications;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }
  
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await prisma.notification.update({
        where: { id: notificationId, userId },
        data: { read: true },
      });
      
      return notification;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }
}
```

## Phase 6: Multilingual Support

### Translation Service
```javascript
// lib/i18n/translationService.ts
interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  'wishlist.title': {
    en: 'My Wishlist',
    hi: 'मेरी इच्छा सूची',
  },
  'cart.title': {
    en: 'My Cart',
    hi: 'मेरी गाड़ी',
  },
  // ... more translations
};

export const t = (key: string, language: 'en' | 'hi' = 'en'): string => {
  return translations[key]?.[language] || key;
};

export const getTranslations = (keys: string[], language: 'en' | 'hi' = 'en') => {
  const result: { [key: string]: string } = {};
  keys.forEach(key => {
    result[key] = t(key, language);
  });
  return result;
};
```

## Phase 7: SEO Optimization

### Dynamic Metadata Generation
```javascript
// lib/seo/metadataGenerator.ts
import { Metadata } from 'next';

interface PageMetadata {
  title: string;
  description: string;
  image?: string;
  url: string;
}

export const generateMetadata = ({
  title,
  description,
  image,
  url,
}: PageMetadata): Metadata => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      url,
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
};
```

## Phase 8: Performance Optimization

### Image Optimization Component
```tsx
// components/ImageOptimized.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function ImageOptimized({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: ImageOptimizedProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Implement lazy loading logic
    const img = new window.Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
```

## Phase 9: Security Enhancements

### Rate Limiting Middleware
```javascript
// lib/security/rateLimit.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const rateLimit = async (identifier: string, limit: number, windowMs: number) => {
  const key = `rate_limit:${identifier}`;
  const current = await redis.get<number>(key);
  
  if (current && current >= limit) {
    return false;
  }
  
  const multi = redis.multi();
  multi.incr(key);
  multi.expire(key, windowMs / 1000);
  await multi.exec();
  
  return true;
};
```

## Implementation Timeline

### Week 1-2: Authentication & Security
- JWT token management
- Secure authentication middleware
- Password reset functionality
- Rate limiting implementation

### Week 3-4: Payment Integration
- Razorpay integration
- Stripe integration
- Payment status tracking
- Refund processing

### Week 5-6: Seller Module
- Seller registration system
- Seller dashboard
- Admin approval workflow
- Product upload interface

### Week 7-8: Search & Filtering
- Advanced search implementation
- Filter components
- Search result optimization
- Autocomplete functionality

### Week 9-10: User Experience
- Notification system
- Order management features
- Address management
- Checkout enhancements

### Week 11-12: Performance & SEO
- Image optimization
- Dynamic metadata
- Sitemap generation
- Performance monitoring

### Week 13-14: Multilingual Support
- Translation system
- Language switching
- RTL support
- Content localization

### Week 15-16: Production Deployment
- Security hardening
- Error handling
- Logging implementation
- Performance testing

This roadmap provides a structured approach to implementing all the remaining features needed for a production-ready e-commerce platform.