import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { handleApiError } from '@/lib/errorHandler';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    // Search products in database
    const searchResult = await db.searchProducts({
      query,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sortBy,
      page,
      limit
    });

    return NextResponse.json({
      success: true,
      ...searchResult,
      filters: {
        query,
        category,
        minPrice,
        maxPrice,
        sortBy
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json(
      { 
        success: false,
        error: message 
      },
      { status: statusCode || 500 }
    );
  }
}