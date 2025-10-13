import { AuditLog, SecurityEvent } from '@/types/auth';
import { securityDb } from '@/lib/database/security';

export interface AuditContext {
  actorId: string;
  actorType: 'user' | 'system';
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
}

export interface SecurityEventContext {
  userId?: string;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
}

export class AuditLogger {
  // Log user action
  async logUserAction(
    action: string,
    targetType: string,
    context: AuditContext,
    targetId?: string,
    changes?: object,
    severity: AuditLog['severity'] = 'low'
  ): Promise<void> {
    try {
      await securityDb.createAuditLog({
        actor_id: context.actorId,
        actor_type: context.actorType,
        action,
        target_type: targetType,
        target_id: targetId,
        changes,
        ip_address: context.ipAddress,
        user_agent: context.userAgent,
        timestamp: new Date().toISOString(),
        severity,
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // In production, you might want to send this to a separate logging service
    }
  }

  // Log security event
  async logSecurityEvent(
    eventType: SecurityEvent['event_type'],
    context: SecurityEventContext,
    details: object = {}
  ): Promise<void> {
    try {
      await securityDb.createSecurityEvent({
        user_id: context.userId,
        event_type: eventType,
        ip_address: context.ipAddress,
        user_agent: context.userAgent,
        details,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Log authentication events
  async logAuth(action: 'login' | 'logout' | 'token_refresh' | 'password_change', context: AuditContext): Promise<void> {
    await this.logUserAction(
      `user_${action}`,
      'authentication',
      context,
      undefined,
      undefined,
      action === 'password_change' ? 'medium' : 'low'
    );
  }

  // Log resource access
  async logResourceAccess(
    resource: string,
    action: 'create' | 'read' | 'update' | 'delete',
    context: AuditContext,
    resourceId?: string,
    changes?: object
  ): Promise<void> {
    const severity = action === 'delete' ? 'high' : action === 'update' ? 'medium' : 'low';
    await this.logUserAction(
      `${resource}_${action}`,
      resource,
      context,
      resourceId,
      changes,
      severity
    );
  }

  // Log admin actions
  async logAdminAction(
    action: string,
    targetType: string,
    context: AuditContext,
    targetId?: string,
    changes?: object
  ): Promise<void> {
    await this.logUserAction(
      action,
      targetType,
      context,
      targetId,
      changes,
      'high' // Admin actions are always high severity
    );
  }

  // Log financial transactions
  async logFinancialAction(
    action: string,
    context: AuditContext,
    amount?: number,
    orderId?: string,
    details?: object
  ): Promise<void> {
    await this.logUserAction(
      action,
      'financial',
      context,
      orderId,
      { amount, ...details },
      'high' // Financial actions are critical
    );
  }

  // Log data export/privacy actions
  async logPrivacyAction(
    action: 'data_export' | 'data_deletion' | 'consent_update',
    context: AuditContext,
    details?: object
  ): Promise<void> {
    await this.logUserAction(
      action,
      'privacy',
      context,
      undefined,
      details,
      'high' // Privacy actions are important for compliance
    );
  }

  // Get audit logs with filtering
  async getAuditLogs(filters: {
    actorId?: string;
    action?: string;
    targetType?: string;
    fromDate?: string;
    toDate?: string;
    severity?: AuditLog['severity'];
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const logs = await securityDb.getAuditLogs(filters);
    
    if (filters.limit) {
      const start = filters.offset || 0;
      return logs.slice(start, start + filters.limit);
    }
    
    return logs;
  }

  // Get security events
  async getSecurityEvents(
    userId?: string,
    eventType?: SecurityEvent['event_type'],
    limit?: number
  ): Promise<SecurityEvent[]> {
    const events = await securityDb.getSecurityEvents(userId);
    
    const filtered = eventType 
      ? events.filter(event => event.event_type === eventType)
      : events;
    
    return limit ? filtered.slice(0, limit) : filtered;
  }

  // Generate audit report
  async generateAuditReport(
    fromDate: string,
    toDate: string,
    actorId?: string
  ): Promise<{
    totalEvents: number;
    eventsByAction: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    securityEvents: number;
    timeRange: { from: string; to: string };
  }> {
    const logs = await this.getAuditLogs({
      fromDate,
      toDate,
      actorId,
    });

    const securityEvents = await securityDb.getSecurityEvents();
    const securityEventsInRange = securityEvents.filter(
      event => event.timestamp >= fromDate && event.timestamp <= toDate &&
               (!actorId || event.user_id === actorId)
    );

    const eventsByAction: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};

    logs.forEach(log => {
      eventsByAction[log.action] = (eventsByAction[log.action] || 0) + 1;
      eventsBySeverity[log.severity] = (eventsBySeverity[log.severity] || 0) + 1;
    });

    return {
      totalEvents: logs.length,
      eventsByAction,
      eventsBySeverity,
      securityEvents: securityEventsInRange.length,
      timeRange: { from: fromDate, to: toDate },
    };
  }

  // Check for suspicious activity patterns
  async detectSuspiciousActivity(userId: string, windowHours: number = 24): Promise<{
    suspicious: boolean;
    reasons: string[];
    riskScore: number;
  }> {
    const fromDate = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
    
    const logs = await this.getAuditLogs({
      actorId: userId,
      fromDate,
    });

    const securityEvents = await securityDb.getSecurityEvents(userId);
    const recentSecurityEvents = securityEvents.filter(
      event => event.timestamp >= fromDate
    );

    const reasons: string[] = [];
    let riskScore = 0;

    // Check for high frequency of actions
    if (logs.length > 100) {
      reasons.push('High frequency of actions detected');
      riskScore += 30;
    }

    // Check for failed login attempts
    const failedLogins = recentSecurityEvents.filter(
      event => event.event_type === 'failed_login'
    );
    if (failedLogins.length > 5) {
      reasons.push('Multiple failed login attempts');
      riskScore += 40;
    }

    // Check for multiple IP addresses
    const uniqueIPs = new Set(logs.map(log => log.ip_address));
    if (uniqueIPs.size > 3) {
      reasons.push('Activity from multiple IP addresses');
      riskScore += 25;
    }

    // Check for privilege escalation attempts
    const adminActions = logs.filter(log => log.action.includes('admin'));
    if (adminActions.length > 0) {
      reasons.push('Attempted admin actions');
      riskScore += 50;
    }

    // Check for data export activities
    const dataExports = logs.filter(log => log.action.includes('export'));
    if (dataExports.length > 2) {
      reasons.push('Multiple data export attempts');
      riskScore += 35;
    }

    return {
      suspicious: riskScore > 50,
      reasons,
      riskScore,
    };
  }

  // Create structured log entry for external systems
  createStructuredLog(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    metadata: object = {}
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'lettex-marketplace',
      version: '1.0.0',
      environment: 'development', // Would be dynamic in production
      ...metadata,
    };

    // In production, send to centralized logging service
    console.log(JSON.stringify(logEntry));
  }
}

// Monitoring and alerting
export class SecurityMonitor {
  private auditLogger: AuditLogger;

  constructor(auditLogger: AuditLogger) {
    this.auditLogger = auditLogger;
  }

  // Monitor for security threats
  async monitorSecurityThreats(): Promise<void> {
    // Check for account lockouts
    await this.checkAccountLockouts();
    
    // Check for failed login patterns
    await this.checkFailedLoginPatterns();
    
    // Check for suspicious admin activity
    await this.checkSuspiciousAdminActivity();
    
    // Check for data breaches
    await this.checkDataBreachIndicators();
  }

  private async checkAccountLockouts(): Promise<void> {
    const recentEvents = await securityDb.getSecurityEvents();
    const lockouts = recentEvents.filter(
      event => event.event_type === 'account_locked' &&
               new Date(event.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    if (lockouts.length > 10) {
      await this.triggerAlert('Multiple account lockouts detected', 'high', {
        count: lockouts.length,
        accounts: lockouts.map(l => l.user_id),
      });
    }
  }

  private async checkFailedLoginPatterns(): Promise<void> {
    const recentEvents = await securityDb.getSecurityEvents();
    const failedLogins = recentEvents.filter(
      event => event.event_type === 'failed_login' &&
               new Date(event.timestamp) > new Date(Date.now() - 60 * 60 * 1000)
    );

    // Group by IP address
    const ipGroups: Record<string, number> = {};
    failedLogins.forEach(event => {
      ipGroups[event.ip_address] = (ipGroups[event.ip_address] || 0) + 1;
    });

    // Check for brute force attacks
    Object.entries(ipGroups).forEach(async ([ip, count]) => {
      if (count > 20) {
        await this.triggerAlert('Potential brute force attack detected', 'critical', {
          ip_address: ip,
          failed_attempts: count,
        });
      }
    });
  }

  private async checkSuspiciousAdminActivity(): Promise<void> {
    const recentLogs = await this.auditLogger.getAuditLogs({
      fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      severity: 'high',
    });

    const adminActions = recentLogs.filter(log => 
      log.action.includes('admin') || log.action.includes('delete')
    );

    if (adminActions.length > 50) {
      await this.triggerAlert('High volume of admin activity', 'medium', {
        actions_count: adminActions.length,
        unique_actors: new Set(adminActions.map(a => a.actor_id)).size,
      });
    }
  }

  private async checkDataBreachIndicators(): Promise<void> {
    const recentLogs = await this.auditLogger.getAuditLogs({
      fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    });

    const dataExports = recentLogs.filter(log => 
      log.action.includes('export') || log.action.includes('data_')
    );

    if (dataExports.length > 10) {
      await this.triggerAlert('Unusual data access patterns detected', 'high', {
        exports_count: dataExports.length,
        unique_actors: new Set(dataExports.map(a => a.actor_id)).size,
      });
    }
  }

  private async triggerAlert(
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    metadata: object
  ): Promise<void> {
    this.auditLogger.createStructuredLog('warn', message, {
      alert: true,
      severity,
      ...metadata,
    });

    // In production, integrate with alerting systems:
    // - Send to Slack/Discord
    // - Send email to security team
    // - Create PagerDuty incident for critical alerts
    // - Store in incident management system
    
    console.warn(`🚨 SECURITY ALERT [${severity.toUpperCase()}]: ${message}`, metadata);
  }
}

// Singleton instances
export const auditLogger = new AuditLogger();
export const securityMonitor = new SecurityMonitor(auditLogger);

export const securityLogger = {
  logSecurityEvent: async (event: SecurityEvent) => {
    try {
      // Add service identifier
      const eventWithService = {
        ...event,
        service: 'lettex-marketplace',
        timestamp: new Date().toISOString()
      };

      // In production, you would store this in a database
      // For now, we'll just log to console
      console.log('Security Event:', JSON.stringify(eventWithService, null, 2));
      
      // Also log to a security log file in production
      // await appendFile('/var/log/security.log', JSON.stringify(eventWithService) + '\n');
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  },

  logUserAction: auditLogger.logUserAction,
  logAuth: auditLogger.logAuth,
  logResourceAccess: auditLogger.logResourceAccess,
  logAdminAction: auditLogger.logAdminAction,
  logFinancialAction: auditLogger.logFinancialAction,
  logPrivacyAction: auditLogger.logPrivacyAction,
  getAuditLogs: auditLogger.getAuditLogs,
  getSecurityEvents: auditLogger.getSecurityEvents,
  generateAuditReport: auditLogger.generateAuditReport,
  detectSuspiciousActivity: auditLogger.detectSuspiciousActivity,
  createStructuredLog: auditLogger.createStructuredLog,
};
