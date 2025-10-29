import { NextRequest, NextResponse } from 'next/server';
import { db, enableRealDatabase } from '@/lib/database/connection';

// Enable real database for API routes
enableRealDatabase();

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All fields are required'
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
    
    // Save contact request to database
    const contactRequest = await db.createContactRequest({ name, email, subject, message });
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: contactRequest
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process contact form'
      },
      { status: 500 }
    );
  }
}

// GET /api/contact - Get all contact requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const contactRequests = await db.getAllContactRequests();
    return NextResponse.json({ 
      success: true, 
      requests: contactRequests,
      count: contactRequests.length
    });
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch contact requests'
      },
      { status: 500 }
    );
  }
}