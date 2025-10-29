import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';
import { withAdminAuth } from '@/lib/auth/middleware';

// Enable real database
enableRealDatabase();

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
    if (!body.title?.en || !body.title?.hi || !body.image) {
      return NextResponse.json(
        { success: false, error: 'Title (English and Hindi) and image are required' },
        { status: 400 }
      );
    }

    // Create the banner in the database
    const banner = await db.createBanner(body);
    
    return NextResponse.json({
      success: true,
      message: 'Banner created successfully',
      banner: banner
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create banner' },
      { status: 500 }
    );
  }
});