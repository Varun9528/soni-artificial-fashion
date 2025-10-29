import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Get all products from the database
    const products = await db.getAllProducts();
    
    // Filter for recently created products (those with timestamps close to now)
    const recentProducts = products.filter((product: any) => {
      // Check if product was created recently (within last hour)
      const productTime = new Date(product.createdAt).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - productTime;
      return timeDiff < 3600000; // 1 hour in milliseconds
    });
    
    return NextResponse.json({
      success: true,
      products: recentProducts,
      count: recentProducts.length,
      totalProducts: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}