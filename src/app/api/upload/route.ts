import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const category = data.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file uploaded' 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'File size too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // For now, return a mock response
    // In production, integrate with Cloudinary or AWS S3
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const mockUrl = `/images/${category}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: mockUrl,
      filename: fileName,
      size: file.size,
      type: file.type,
      message: 'File upload simulation - integrate with Cloudinary/S3 for production'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file path provided' 
      }, { status: 400 });
    }

    // Security check: ensure path is within images directory
    if (!filePath.startsWith('/images/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file path' 
      }, { status: 400 });
    }

    // Mock deletion response
    return NextResponse.json({
      success: true,
      message: 'File deletion simulation - integrate with Cloudinary/S3 for production'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete file' 
    }, { status: 500 });
  }
}