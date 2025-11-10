import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection and data retrieval...');
    
    // Test fetching all products
    const allProducts = await db.getAllProducts();
    console.log(`Found ${allProducts.length} total products`);
    
    // Test fetching featured products
    const featuredProducts = await db.getProducts({ featured: true, limit: 10 });
    console.log(`Found ${featuredProducts.length} featured products`);
    
    // Test fetching new arrivals
    const newArrivals = await db.getProducts({ newArrival: true, limit: 10 });
    console.log(`Found ${newArrivals.length} new arrival products`);
    
    // Test fetching best sellers
    const bestSellers = await db.getProducts({ bestSeller: true, limit: 10 });
    console.log(`Found ${bestSellers.length} best seller products`);
    
    // Test fetching categories
    const categories = await db.getAllCategories();
    console.log(`Found ${categories.length} categories`);
    
    // Test fetching artisans
    const artisans = await db.getAllArtisans();
    console.log(`Found ${artisans.length} artisans`);
    
    const response = {
      success: true,
      message: 'Database connection and data retrieval working correctly',
      stats: {
        totalProducts: allProducts.length,
        featuredProducts: featuredProducts.length,
        newArrivals: newArrivals.length,
        bestSellers: bestSellers.length,
        categories: categories.length,
        artisans: artisans.length
      },
      sampleProducts: allProducts.slice(0, 3).map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        featured: product.featured,
        bestSeller: product.bestSeller,
        newArrival: product.newArrival
      })),
      categories: categories.map(category => ({
        id: category.id,
        name: category.name
      }))
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error testing database:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to test database connection'
      },
      { status: 500 }
    );
  }
}