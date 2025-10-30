import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Get all banners from the database
    const banners = await db.getAllBanners();
    
    // Also test the filtering logic used in BannerSlider
    const activeBanners = banners
      .filter((banner: any) => banner.is_active === 1)
      .sort((a: any, b: any) => a.display_order - b.display_order);
    
    return NextResponse.json({ 
      success: true, 
      banners,
      activeBanners,
      count: banners.length,
      activeCount: activeBanners.length,
      sampleBanner: banners[0] || null
    });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}