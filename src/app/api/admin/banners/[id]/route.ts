import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database for API routes
import { enableRealDatabase } from '@/lib/database/connection';
enableRealDatabase();

// GET a single banner by ID
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Banner ID is required'
      }, { status: 400 });
    }
    
    // Get all banners and find the one with matching ID
    const banners = await db.getAllBanners();
    const banner = banners.find((b: any) => b.id === id);
    
    if (!banner) {
      return NextResponse.json({
        success: false,
        error: 'Banner not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      banner
    });

  } catch (error: any) {
    console.error('Error fetching banner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch banner'
    }, { status: 500 });
  }
});

// UPDATE a banner by ID
export const PUT = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Banner ID is required'
      }, { status: 400 });
    }
    
    const body = await request.json();
    
    // Update the banner in the database
    const updatedBanner = await db.updateBanner(id, body);

    return NextResponse.json({
      success: true,
      banner: updatedBanner,
      message: 'Banner updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating banner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update banner: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});

// DELETE a banner by ID
export const DELETE = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Extract ID from URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Banner ID is required'
      }, { status: 400 });
    }
    
    // Delete the banner from the database
    const deleted = await db.deleteBanner(id);
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Banner not found or could not be deleted'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete banner: ' + (error.message || 'Unknown error')
    }, { status: 500 });
  }
});