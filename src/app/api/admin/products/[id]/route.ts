import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
import { enableRealDatabase } from '@/lib/database/connection';
enableRealDatabase();

// GET a single product by ID
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }
    
    // Get all products and find the one with matching ID
    const products = await db.getAllProducts();
    const product = products.find((p: any) => p.id === id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 });
  }
});

// UPDATE a product by ID
export const PUT = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Update the product in the database
    const updatedProduct = await db.updateProduct(id, body);

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});

// DELETE a product by ID
export const DELETE = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }
    
    // Delete the product from the database
    const deleted = await db.deleteProduct(id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Product not found or could not be deleted'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});