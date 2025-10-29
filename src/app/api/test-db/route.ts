import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Test finding user
    const user = await db.findUserByEmail('user@lettex.com');
    
    // Test finding admin
    const admin = await db.findUserByEmail('admin@lettex.com');
    
    // Test getting all categories
    const categories = await db.getAllCategories();
    
    // Test getting products
    const products = await db.getProducts({ limit: 5 });
    
    return NextResponse.json({ 
      user, 
      admin,
      categories: categories.length,
      products: products.length
    });
  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json({ error: 'Database test failed' }, { status: 500 });
  }
}