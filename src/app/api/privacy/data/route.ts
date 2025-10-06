import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { securityDb } from '@/lib/database/security';
import { auditLogger } from '@/lib/security/audit';

// GDPR/CCPA Data Export
export const GET = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    
    // Get user data
    const user = await securityDb.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user sessions
    const sessions = await securityDb.getUserSessions(userId);
    
    // Get audit logs
    const auditLogs = await auditLogger.getAuditLogs({
      actorId: userId,
      limit: 1000, // Limit for performance
    });
    
    // Get security events
    const securityEvents = await auditLogger.getSecurityEvents(userId);
    
    // Remove sensitive data
    const { password_hash, mfa_secret, ...userData } = user;
    
    const exportData = {
      user: userData,
      sessions: sessions.map(session => ({
        id: session.id,
        created_at: session.created_at,
        last_active_at: session.last_active_at,
        ip_address: session.ip_address,
        user_agent: session.user_agent,
      })),
      auditLogs: auditLogs.map(log => ({
        action: log.action,
        timestamp: log.timestamp,
        ip_address: log.ip_address,
        target_type: log.target_type,
      })),
      securityEvents: securityEvents.map(event => ({
        event_type: event.event_type,
        timestamp: event.timestamp,
        details: event.details,
      })),
      exportedAt: new Date().toISOString(),
      exportFormat: format,
    };
    
    // Log data export
    await auditLogger.logPrivacyAction(
      'data_export',
      {
        actorId: userId,
        actorType: 'user',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
      { format, recordCount: Object.keys(exportData).length }
    );
    
    if (format === 'csv') {
      // Convert to CSV format (simplified)
      const csv = convertToCSV(exportData);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="user-data-${userId}.csv"`,
        },
      });
    }
    
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="user-data-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// GDPR/CCPA Data Deletion
export const DELETE = withAuth(async (request: NextRequest, authContext: any) => {
  try {
    const userId = authContext.user.id;
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm') === 'true';
    
    if (!confirm) {
      return NextResponse.json(
        { 
          error: 'Data deletion requires confirmation',
          message: 'Add ?confirm=true to the request to confirm deletion',
        },
        { status: 400 }
      );
    }
    
    // Log data deletion request
    await auditLogger.logPrivacyAction(
      'data_deletion',
      {
        actorId: userId,
        actorType: 'user',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
      { confirmed: true }
    );
    
    // Delete user data (in order of dependencies)
    // 1. Revoke all sessions and tokens
    await securityDb.revokeAllUserTokens(userId);
    
    // 2. Anonymize audit logs (keep for compliance but remove PII)
    const userLogs = await auditLogger.getAuditLogs({ actorId: userId });
    // In production, anonymize rather than delete audit logs
    
    // 3. Delete user account
    const deleted = await securityDb.deleteUser(userId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found or already deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'User data deleted successfully',
      deletedAt: new Date().toISOString(),
      note: 'Some audit logs may be retained for legal compliance',
    });
  } catch (error) {
    console.error('Data deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Helper function to convert data to CSV
function convertToCSV(data: any): string {
  // Simplified CSV conversion
  const headers = Object.keys(data).join(',');
  const values = Object.values(data).map(value => 
    typeof value === 'object' ? JSON.stringify(value) : value
  ).join(',');
  
  return `${headers}\\n${values}`;
}