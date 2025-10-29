import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
import { enableRealDatabase } from '@/lib/database/connection';
enableRealDatabase();

// GET a single artisan by ID
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Artisan ID is required'
      }, { status: 400 });
    }
    
    // Get all artisans and find the one with matching ID
    const artisans = await db.getAllArtisans();
    const artisan = artisans.find((a: any) => a.id === id);
    
    if (!artisan) {
      return NextResponse.json({
        success: false,
        error: 'Artisan not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      artisan
    });

  } catch (error: any) {
    console.error('Error fetching artisan:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch artisan'
    }, { status: 500 });
  }
});

// UPDATE an artisan by ID
export const PUT = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Artisan ID is required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Update the artisan in the database
    const updatedArtisan = await db.updateArtisan(id, body);

    return NextResponse.json({
      success: true,
      artisan: updatedArtisan,
      message: 'Artisan updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating artisan:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update artisan: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});

// DELETE an artisan by ID
export const DELETE = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Artisan ID is required'
      }, { status: 400 });
    }
    
    // Delete the artisan from the database
    const deleted = await db.deleteArtisan(id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Artisan not found or could not be deleted'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Artisan deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting artisan:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete artisan: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});