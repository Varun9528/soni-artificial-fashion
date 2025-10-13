import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';

export async function GET(request: NextRequest) {
  try {
    // Get all products from the database
    const products = await db.getAllProducts();
    
    // Format products for frontend
    const formattedProducts = products.map((product: any) => {
      // Get the primary image if available
      const primaryImage = product.productImages && product.productImages.length > 0 
        ? product.productImages.find((img: any) => img.isPrimary) || product.productImages[0]
        : null;
      
      return {
        id: product.id,
        slug: product.slug,
        title_en: product.title?.en || product.title_en,
        title_hi: product.title?.hi || product.title_hi,
        description_en: product.description?.en || product.description_en,
        description_hi: product.description?.hi || product.description_hi,
        price: product.price,
        original_price: product.originalPrice,
        stock: product.stock,
        rating: product.rating,
        review_count: product.reviewCount,
        category: product.category,
        images: primaryImage ? [primaryImage.url] : [],
        productImages: product.productImages,
        featured: product.featured,
        best_seller: product.bestSeller,
        is_active: product.isActive,
        created_at: product.createdAt
      };
    });
    
    return NextResponse.json({
      success: true,
      products: formattedProducts,
      count: formattedProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        products: []
      },
      { status: 500 }
    );
  }
}