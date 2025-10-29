import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'OK',
    message: 'Health check passed',
    timestamp: new Date().toISOString()
  });
}