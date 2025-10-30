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
    const products = await db.getProducts({ limit: 5 });
    
    // Test getting categories
    const categories = await db.getAllCategories();
    
    // Test getting artisans
    const artisans = await db.getAllArtisans();
    
    return NextResponse.json({ 
      success: true, 
      stats,
      banners: banners.length,
      products: products.length,
      categories: categories.length,
      artisans: artisans.length,
      message: 'Database connection and data access working correctly'
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Health check failed' },
      { status: 500 }
    );
  }
}