import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mark all unread notifications as read
    const result = await prisma.notification.updateMany({
      where: {
        user_id: session.user.id,
        read_at: null
      },
      data: {
        read_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `Marked ${result.count} notifications as read`
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}