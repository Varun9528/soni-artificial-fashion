import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    let { slug } = resolvedParams;
    
    // If slug looks like a product ID (starts with prod-), find by ID instead
    let product;
    if (slug.startsWith('prod-')) {
      // Try to get product by ID from the database
      const allProducts = await db.getAllProducts();
      product = allProducts.find((p: any) => p.id === slug);
    } else {
      // Get product by slug from the database
      product = await db.getProductBySlug(slug);
    }
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Format product for frontend
    const formattedProduct = {
      id: product.id,
      slug: product.slug || product.id, // Use ID as slug if slug is missing
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      categoryId: product.categoryId,
      artisan_id: product.artisanId,
      images: product.images,
      productImages: product.productImages, // Include productImages for consistency
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