import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Get all products from the database
    const products = await db.getAllProducts();
    
    return NextResponse.json({
      success: true,
      products: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}