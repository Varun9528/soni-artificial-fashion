import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
import { enableRealDatabase } from '@/lib/database/connection';
enableRealDatabase();

// GET a single category by ID
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }
    
    // Get all categories and find the one with matching ID
    const categories = await db.getAllCategories();
    const category = categories.find((c: any) => c.id === id);
    
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

  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category'
    }, { status: 500 });
  }
});

// UPDATE a category by ID
export const PUT = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      image,
      featured,
      isActive,
      displayOrder
    } = body;

    // Validate required fields
    if (!name?.en || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Name and slug are required'
      }, { status: 400 });
    }

    // Update the category
    const category = await db.updateCategory(id, {
      name,
      slug,
      description,
      image,
      featured,
      isActive,
      displayOrder
    });

    return NextResponse.json({
      success: true,
      category,
      message: 'Category updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update category: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});

// DELETE a category by ID
export const DELETE = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Category ID is required'
      }, { status: 400 });
    }
    
    // Delete the category
    const deleted = await db.deleteCategory(id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Category not found or could not be deleted'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});