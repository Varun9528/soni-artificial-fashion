import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/middleware';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    // Get real data from the database
    const products = await db.getAllProducts();
    const categories = await db.getAllCategories();
    const artisans = await db.getAllArtisans();
    const banners = await db.getAllBanners();

    // Calculate real stats
    const stats = {
      totalProducts: products.length,
      totalOrders: await db.getTotalOrders(),
      totalUsers: await db.getTotalUsers(),
      totalArtisans: artisans.length,
      totalRevenue: await db.getTotalRevenue(),
      totalCategories: categories.length,
      totalBanners: banners.length
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
});