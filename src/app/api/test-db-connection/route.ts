import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Test database connection by fetching banners
    const banners = await db.getAllBanners();
    
    // Also test fetching products to verify database connectivity
    const products = await db.getProducts({ limit: 5 });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      banners: banners.length,
      products: products.length,
      bannerData: banners.slice(0, 2), // Show first 2 banners
      productData: products.slice(0, 2) // Show first 2 products
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database connection failed' },
      { status: 500 }
    );
  }
}