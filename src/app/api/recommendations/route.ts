import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';
import { Product } from '@/data/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const categoryId = searchParams.get('categoryId');
  const type = searchParams.get('type') || 'similar'; // similar, trending, popular

  try {
    let recommendations: Product[] = [];

    if (type === 'trending') {
      // Return trending products (mock logic)
      recommendations = products
        .filter(p => p.featured || p.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    } else if (type === 'popular') {
      // Return popular products
      recommendations = products
        .sort((a, b) => b.reviewCount - a.reviewCount)
        .slice(0, 6);
    } else if (productId) {
      // Similar products based on product ID
      const currentProduct = products.find(p => p.id === productId);
      if (currentProduct) {
        recommendations = products
          .filter(p => 
            p.id !== productId && 
            (p.categoryId === currentProduct.categoryId || 
             p.artisanId === currentProduct.artisanId)
          )
          .slice(0, 6);
      }
    } else if (categoryId) {
      // Similar products based on category
      recommendations = products
        .filter(p => p.categoryId === categoryId)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
    } else {
      // Default: return random selection
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      recommendations = shuffled.slice(0, 6);
    }

    return NextResponse.json({
      status: 'success',
      type,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}