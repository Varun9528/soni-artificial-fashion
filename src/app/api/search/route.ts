import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sortBy = searchParams.get('sortBy') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    // Build the query conditions
    const whereConditions: any = {
      isActive: true
    };

    // Search filter
    if (query.trim()) {
      whereConditions.OR = [
        {
          tags: {
            contains: query
          }
        },
        {
          productMaterials: {
            some: {
              material: {
                contains: query
              }
            }
          }
        }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      whereConditions.categoryId = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      whereConditions.price = {};
      if (minPrice) {
        whereConditions.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        whereConditions.price.lte = parseFloat(maxPrice);
      }
    }

    // Build the sorting options
    let orderBy: any = {};
    switch (sortBy) {
      case 'price_low_high':
        orderBy = { price: 'asc' };
        break;
      case 'price_high_low':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popularity':
        orderBy = { saleCount: 'desc' };
        break;
      case 'name':
        orderBy = { title: 'asc' };
        break;
      default: // relevance
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({
      where: whereConditions
    });

    // Get the products
    const products = await prisma.product.findMany({
      where: whereConditions,
      orderBy: orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        artisan: {
          select: {
            id: true,
            name: true,
            village: true
          }
        },
        productImages: {
          select: {
            url: true,
            isPrimary: true
          }
        },
        productMaterials: {
          select: {
            material: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    // Transform the data to match the expected format
    const transformedProducts = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      inStock: product.inStock,
      featured: product.featured,
      bestSeller: product.bestSeller,
      newArrival: product.newArrival,
      trending: product.trending,
      rating: product.rating,
      reviewCount: product._count.reviews,
      images: product.productImages.map((img: any) => img.url),
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug
      },
      artisan: {
        id: product.artisan.id,
        name: product.artisan.name,
        village: product.artisan.village
      },
      tags: product.tags ? product.tags.split(',') : [],
      materials: product.productMaterials.map((m: any) => m.material),
      createdAt: product.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalProducts: totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1
      },
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
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}