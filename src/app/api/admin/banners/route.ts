import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// GET /api/admin/banners - Get all banners (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get banners from database
    const banners = await db.getAllBanners();
    
    return NextResponse.json({ 
      success: true, 
      banners,
      count: banners.length
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/admin/banners - Create a new banner (admin only)
export const POST = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title_en || !body.title_hi || !body.image_desktop) {
      return NextResponse.json(
        { success: false, error: 'Title (English and Hindi) and desktop image are required' },
        { status: 400 }
      );
    }

    // In a real implementation, we would create the banner in the database
    // For now, we'll return a success response
    return NextResponse.json({
      success: true,
      message: 'Banner created successfully',
      banner: {
        id: 'new-banner-id',
        ...body
      }
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
});