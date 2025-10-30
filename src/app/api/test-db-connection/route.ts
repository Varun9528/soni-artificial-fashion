import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Test database connection by getting dashboard stats
    const stats = await db.getDashboardStats();
    
    // Also test getting banners
    const banners = await db.getAllBanners();
    
    // Test getting products
    const products = await db.getProducts({ limit: 3 });
    
    return NextResponse.json({ 
      success: true, 
      stats,
      banners: banners.length,
      products: products.length,
      message: 'Database connection and data access working correctly'
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database connection failed' },
      { status: 500 }
    );
  }
}