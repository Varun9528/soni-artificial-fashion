import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const faviconPath = join(process.cwd(), 'public', 'favicon.ico');
    const faviconBuffer = await readFile(faviconPath);
    
    return new NextResponse(new Uint8Array(faviconBuffer), {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving favicon:', error);
    return new NextResponse('Favicon not found', { status: 404 });
  }
}