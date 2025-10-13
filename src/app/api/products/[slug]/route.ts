import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    // Get product by slug from the database
    const product = await db.getProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Format product for frontend
    const formattedProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      categoryId: product.categoryId,
      artisanId: product.artisanId,
      images: product.images,
      material: product.material,
      dimensions: product.dimensions,
      tags: product.tags,
      featured: product.featured,
      bestSeller: product.bestSeller,
      trending: product.trending,
      newArrival: product.newArrival,
      createdAt: product.createdAt,
      category: product.category,
      artisan: product.artisan
    };
    
    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}