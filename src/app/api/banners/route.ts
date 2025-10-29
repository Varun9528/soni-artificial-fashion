import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function GET(request: NextRequest) {
  try {
    // Get all banners from the database
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