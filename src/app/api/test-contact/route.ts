import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name,
      email,
      subject,
      message
    } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Create contact request
    const contactRequest = await prisma.contact_requests.create({
      data: {
        id: `contact-${Date.now()}`,
        name,
        email,
        subject: subject || '',
        message,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      contactRequest: {
        id: contactRequest.id,
        name: contactRequest.name,
        email: contactRequest.email,
        subject: contactRequest.subject,
        created_at: contactRequest.created_at
      }
    });
    
  } catch (error) {
    console.error('Error creating contact request:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}