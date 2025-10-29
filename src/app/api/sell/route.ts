import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, businessName, businessType, products, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !phone || !businessName || !businessType || !products) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Required fields are missing'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }
    
    // Save sell request to database
    const sellRequest = await db.createSellRequest({ name, email, phone, businessName, businessType, products, message });
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest in selling on Soni Fashion. Our team will review your application and get back to you within 3-5 business days.',
      data: sellRequest
    });
  } catch (error) {
    console.error('Error processing sell form:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process sell form'
      },
      { status: 500 }
    );
  }
}

// GET /api/sell - Get all sell requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const sellRequests = await db.getAllSellRequests();
    return NextResponse.json({ 
      success: true, 
      requests: sellRequests,
      count: sellRequests.length
    });
  } catch (error) {
    console.error('Error fetching sell requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sell requests'
      },
      { status: 500 }
    );
  }
}