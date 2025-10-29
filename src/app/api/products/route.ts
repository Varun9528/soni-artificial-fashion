import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestSeller');
    const newArrival = searchParams.get('newArrival');
    const limit = searchParams.get('limit');
    
    // Prepare filters
    const filters: any = {};
    if (category) filters.category = category;
    if (featured === 'true') filters.featured = true;
    if (bestSeller === 'true') filters.bestSeller = true;
    if (newArrival === 'true') filters.newArrival = true;
    if (limit) filters.limit = parseInt(limit);
    
    // If any filters are applied, use searchProducts to get pagination data, otherwise use getAllProducts
    let result;
    if (Object.keys(filters).length > 0) {
      // Convert filters to searchParams format for searchProducts
      const searchParams: any = {
        category: filters.category,
        featured: filters.featured,
        bestSeller: filters.bestSeller,
        newArrival: filters.newArrival,
        limit: filters.limit,
        page: 1 // Add default page parameter
      };
      result = await db.searchProducts(searchParams);
    } else {
      const products = await db.getAllProducts();
      result = {
        products: products,
        pagination: {
          totalProducts: products.length
        }
      };
    }
    
    // Format products for frontend
    const formattedProducts = result.products.map((product: any) => {
      // Get the primary image if available
      const primaryImage = product.productImages && product.productImages.length > 0 
        ? product.productImages.find((img: any) => img.isPrimary) || product.productImages[0]
        : null;
      
      return {
        id: product.id,
        slug: product.slug,
        title: product.title, // Keep the title as an object with en and hi properties
        description: product.description, // Keep the description as an object with en and hi properties
        price: product.price,
        original_price: product.originalPrice,
        stock: product.stock,
        rating: product.rating,
        review_count: product.reviewCount,
        category: product.category,
        images: primaryImage ? [primaryImage.url] : product.images || [],
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
      pagination: result.pagination,
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