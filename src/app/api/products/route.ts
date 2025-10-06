import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestSeller');
    const newArrival = searchParams.get('newArrival');
    const trending = searchParams.get('trending');

    // Filter products based on query parameters
    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === category);
    }

    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }

    if (bestSeller === 'true') {
      filteredProducts = filteredProducts.filter(p => p.bestSeller);
    }

    if (newArrival === 'true') {
      filteredProducts = filteredProducts.filter(p => p.newArrival);
    }

    if (trending === 'true') {
      filteredProducts = filteredProducts.filter(p => p.trending);
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      total: filteredProducts.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}