import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/auth/middleware';

// GET a single category by ID
export const GET = withAdminAuth(async (request: NextRequest, authContext: any, params: { id: string }) => {
  try {
    const { id } = params;
    
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category'
    }, { status: 500 });
  }
});

// UPDATE a category by ID
export const PUT = withAdminAuth(async (request: NextRequest, authContext: any, params: { id: string }) => {
  try {
    const { id } = params;
    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      image,
      featured,
      isActive,
      sortOrder
    } = body;

    // Validate required fields
    if (!name?.en || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Name and slug are required'
      }, { status: 400 });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Check if slug already exists (excluding current category)
    const existingSlug = await prisma.category.findFirst({
      where: { 
        slug,
        NOT: { id }
      }
    });

    if (existingSlug) {
      return NextResponse.json({
        success: false,
        error: 'Category with this slug already exists'
      }, { status: 400 });
    }

    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || existingCategory.description,
        image: image || existingCategory.image,
        featured: featured !== undefined ? Boolean(featured) : existingCategory.featured,
        isActive: isActive !== undefined ? Boolean(isActive) : existingCategory.isActive,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existingCategory.sortOrder
      }
    });

    return NextResponse.json({
      success: true,
      category,
      message: 'Category updated successfully'
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update category'
    }, { status: 500 });
  }
});

// DELETE a category by ID
export const DELETE = withAdminAuth(async (request: NextRequest, authContext: any, params: { id: string }) => {
  try {
    const { id } = params;
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete category with associated products. Please reassign products first.'
      }, { status: 400 });
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category'
    }, { status: 500 });
  }
});