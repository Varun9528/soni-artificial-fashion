import { NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

export async function GET() {
  try {
    // Test getting all products
    const products = await db.getAllProducts();
    console.log('Products:', products);
    
    // Test getting all categories
    const categories = await db.getAllCategories();
    console.log('Categories:', categories);
    
    // Test getting all artisans
    const artisans = await db.getAllArtisans();
    console.log('Artisans:', artisans);
    
    // Test getting all banners
    const banners = await db.getAllBanners();
    console.log('Banners:', banners);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and queries successful',
      data: {
        products: products.length,
        categories: categories.length,
        artisans: artisans.length,
        banners: banners.length
      }
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}