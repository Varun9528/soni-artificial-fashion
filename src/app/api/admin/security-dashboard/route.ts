import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/middleware';
import { auditLogger, securityMonitor } from '@/lib/security/audit';
import { sessionManager } from '@/lib/security/session';
import { securityDb } from '@/lib/database/security';

// Security Dashboard for Administrators
export const GET = withAdminAuth(async (request: NextRequest, authContext: any) => {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    
    // Calculate date range
    const now = new Date();
    let fromDate: Date;
    
    switch (timeframe) {
      case '1h':
        fromDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // Get security metrics
    const [
      securityEvents,
      auditLogs,
      totalUsers,
      activeSessionsCount,
    ] = await Promise.all([
      securityDb.getSecurityEvents(),
      auditLogger.getAuditLogs({ fromDate: fromDate.toISOString() }),
      getUserCount(),
      getActiveSessionsCount(),
    ]);
    
    // Filter events by timeframe
    const recentSecurityEvents = securityEvents.filter(
      event => new Date(event.timestamp) >= fromDate
    );
    
    // Calculate security metrics
    const securityMetrics = {
      overview: {
        totalUsers,
        activeSessionsCount,
        securityEventsCount: recentSecurityEvents.length,
        auditLogsCount: auditLogs.length,
        timeframe,
      },
      
      securityEvents: {
        total: recentSecurityEvents.length,
        byType: groupEventsByType(recentSecurityEvents),
        recent: recentSecurityEvents.slice(0, 10),
      },
      
      auditActivity: {
        total: auditLogs.length,
        bySeverity: groupLogsBySeverity(auditLogs),
        byAction: groupLogsByAction(auditLogs),
        recent: auditLogs.slice(0, 10),
      },
      
      authentication: {
        failedLogins: recentSecurityEvents.filter(e => e.event_type === 'failed_login').length,
        accountLockouts: recentSecurityEvents.filter(e => e.event_type === 'account_locked').length,
        passwordResets: recentSecurityEvents.filter(e => e.event_type === 'password_reset').length,
        mfaEvents: recentSecurityEvents.filter(e => e.event_type === 'mfa_enabled' || e.event_type === 'mfa_disabled').length,
      },
      
      sessions: {
        totalActive: activeSessionsCount,
        averagePerUser: totalUsers > 0 ? (activeSessionsCount / totalUsers).toFixed(2) : 0,
        suspiciousPatterns: await detectSuspiciousSessionPatterns(),
      },
      
      riskAssessment: {
        overallRiskScore: calculateOverallRiskScore(recentSecurityEvents, auditLogs),
        riskFactors: identifyRiskFactors(recentSecurityEvents, auditLogs),
        recommendations: generateSecurityRecommendations(recentSecurityEvents, auditLogs),
      },
      
      compliance: {
        privacyRequests: auditLogs.filter(log => log.action.includes('data_export') || log.action.includes('data_deletion')).length,
        gdprCompliance: checkGDPRCompliance(),
        dataRetention: checkDataRetentionCompliance(),
      },
    };
    
    return NextResponse.json(securityMetrics);
  } catch (error) {
    console.error('Security dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to generate security dashboard' },
      { status: 500 }
    );
  }
});

// Helper functions
async function getUserCount(): Promise<number> {
  const users = await securityDb['users'];
  return users.size;
}

async function getActiveSessionsCount(): Promise<number> {
  const sessions = await securityDb['sessions'];
  const activeSessions = Array.from(sessions.values()).filter(s => !s.revoked_at);
  return activeSessions.length;
}

function groupEventsByType(events: any[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  events.forEach(event => {
    grouped[event.event_type] = (grouped[event.event_type] || 0) + 1;
  });
  return grouped;
}

function groupLogsBySeverity(logs: any[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  logs.forEach(log => {
    grouped[log.severity] = (grouped[log.severity] || 0) + 1;
  });
  return grouped;
}

function groupLogsByAction(logs: any[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  logs.forEach(log => {
    grouped[log.action] = (grouped[log.action] || 0) + 1;
  });
  return grouped;
}

async function detectSuspiciousSessionPatterns(): Promise<string[]> {
  const patterns: string[] = [];
  
  // Check for concurrent sessions from different locations
  const sessions = await securityDb['sessions'];
  const activeSessions = Array.from(sessions.values()).filter(s => !s.revoked_at);
  
  // Group by user
  const sessionsByUser: Record<string, any[]> = {};
  activeSessions.forEach(session => {
    if (!sessionsByUser[session.user_id]) {
      sessionsByUser[session.user_id] = [];
    }
    sessionsByUser[session.user_id].push(session);
  });
  
  // Check for suspicious patterns
  Object.entries(sessionsByUser).forEach(([userId, userSessions]) => {
    if (userSessions.length > 5) {
      patterns.push(`User ${userId} has ${userSessions.length} concurrent sessions`);
    }
    
    const uniqueIPs = new Set(userSessions.map(s => s.ip_address));
    if (uniqueIPs.size > 3) {
      patterns.push(`User ${userId} has sessions from ${uniqueIPs.size} different IP addresses`);
    }
  });
  
  return patterns;
}

function calculateOverallRiskScore(securityEvents: any[], auditLogs: any[]): number {
  let riskScore = 0;
  
  // Failed login attempts (weight: 2)
  const failedLogins = securityEvents.filter(e => e.event_type === 'failed_login').length;
  riskScore += failedLogins * 2;
  
  // Account lockouts (weight: 5)
  const lockouts = securityEvents.filter(e => e.event_type === 'account_locked').length;
  riskScore += lockouts * 5;
  
  // High severity audit events (weight: 3)
  const highSeverityLogs = auditLogs.filter(log => log.severity === 'high').length;
  riskScore += highSeverityLogs * 3;
  
  // Critical severity audit events (weight: 10)
  const criticalLogs = auditLogs.filter(log => log.severity === 'critical').length;
  riskScore += criticalLogs * 10;
  
  // Normalize score to 0-100 scale
  return Math.min(riskScore, 100);
}

function identifyRiskFactors(securityEvents: any[], auditLogs: any[]): string[] {
  const riskFactors: string[] = [];
  
  const failedLogins = securityEvents.filter(e => e.event_type === 'failed_login').length;
  if (failedLogins > 10) {
    riskFactors.push(`High number of failed login attempts: ${failedLogins}`);
  }
  
  const lockouts = securityEvents.filter(e => e.event_type === 'account_locked').length;
  if (lockouts > 5) {
    riskFactors.push(`Multiple account lockouts detected: ${lockouts}`);
  }
  
  const criticalLogs = auditLogs.filter(log => log.severity === 'critical').length;
  if (criticalLogs > 0) {
    riskFactors.push(`Critical security events detected: ${criticalLogs}`);
  }
  
  const dataExports = auditLogs.filter(log => log.action.includes('data_export')).length;
  if (dataExports > 5) {
    riskFactors.push(`Unusual number of data exports: ${dataExports}`);
  }
  
  return riskFactors;
}

function generateSecurityRecommendations(securityEvents: any[], auditLogs: any[]): string[] {
  const recommendations: string[] = [];
  
  const failedLogins = securityEvents.filter(e => e.event_type === 'failed_login').length;
  if (failedLogins > 20) {
    recommendations.push('Consider implementing additional rate limiting for login attempts');
    recommendations.push('Review and potentially strengthen password policies');
  }
  
  const lockouts = securityEvents.filter(e => e.event_type === 'account_locked').length;
  if (lockouts > 10) {
    recommendations.push('Investigate potential brute force attacks');
    recommendations.push('Consider implementing CAPTCHA for repeated failed attempts');
  }
  
  const mfaDisabled = securityEvents.filter(e => e.event_type === 'mfa_disabled').length;
  if (mfaDisabled > 0) {
    recommendations.push('Review MFA disable events and consider enforcing MFA for sensitive accounts');
  }
  
  const highPrivilegeActions = auditLogs.filter(log => 
    log.action.includes('admin') || log.action.includes('delete')
  ).length;
  if (highPrivilegeActions > 50) {
    recommendations.push('High volume of privileged actions detected - review admin activity');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Security posture appears healthy - continue monitoring');
  }
  
  return recommendations;
}

function checkGDPRCompliance(): { compliant: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // In a real implementation, check:
  // - Data retention policies
  // - Consent management
  // - Data processing agreements
  // - Privacy policy compliance
  
  return {
    compliant: issues.length === 0,
    issues,
  };
}

function checkDataRetentionCompliance(): { compliant: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // In a real implementation, check:
  // - Old user accounts
  // - Expired sessions
  // - Old audit logs
  // - Backup retention
  
  return {
    compliant: issues.length === 0,
    issues,
  };
}