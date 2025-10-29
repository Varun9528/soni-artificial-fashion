import { Session, User } from '@/types/auth';
import { securityDb } from '@/lib/database/security';
import { auditLogger } from '@/lib/security/audit';

export interface DeviceInfo {
  fingerprint: string;
  userAgent: string;
  ipAddress: string;
  platform?: string;
  browser?: string;
  os?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface SessionSummary {
  id: string;
  deviceInfo: DeviceInfo;
  createdAt: string;
  lastActiveAt: string;
  current: boolean;
  location?: string;
}

export class SessionManager {
  // Create new session
  async createSession(
    userId: string,
    refreshTokenId: string,
    deviceInfo: DeviceInfo
  ): Promise<Session> {
    const session = await securityDb.createSession({
      user_id: userId,
      refresh_token_id: refreshTokenId,
      device_fingerprint: deviceInfo.fingerprint,
      ip_address: deviceInfo.ipAddress,
      user_agent: deviceInfo.userAgent,
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    });

    // Log session creation
    await auditLogger.logUserAction(
      'session_created',
      'session',
      {
        actorId: userId,
        actorType: 'user',
        ipAddress: deviceInfo.ipAddress,
        userAgent: deviceInfo.userAgent,
        sessionId: session.id,
      },
      session.id,
      {
        device_fingerprint: deviceInfo.fingerprint,
        platform: deviceInfo.platform,
        browser: deviceInfo.browser,
      },
      'low'
    );

    return session;
  }

  // Get user sessions
  async getUserSessions(userId: string): Promise<SessionSummary[]> {
    const sessions = await securityDb.getUserSessions(userId);
    
    return sessions.map(session => ({
      id: session.id,
      deviceInfo: this.parseDeviceInfo(session),
      createdAt: session.created_at,
      lastActiveAt: session.last_active_at,
      current: false, // Will be set by caller
      location: this.formatLocation(session.ip_address),
    }));
  }

  // Update session activity
  async updateSessionActivity(
    sessionId: string,
    ipAddress?: string
  ): Promise<void> {
    await securityDb.updateSessionActivity(sessionId);
    
    // If IP address changed, log it as potential security event
    if (ipAddress) {
      const session = await securityDb.getSession(sessionId);
      if (session && session.ip_address !== ipAddress) {
        await auditLogger.logSecurityEvent(
          'suspicious_activity',
          {
            userId: session.user_id,
            ipAddress: ipAddress,
            userAgent: session.user_agent,
            sessionId: sessionId,
          },
          {
            type: 'ip_address_change',
            old_ip: session.ip_address,
            new_ip: ipAddress,
          }
        );
      }
    }
  }

  // Revoke session
  async revokeSession(
    sessionId: string,
    revokedBy: string,
    reason: string = 'user_logout'
  ): Promise<void> {
    const session = await securityDb.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    await securityDb.revokeSession(sessionId);

    // Revoke associated refresh token
    await securityDb.revokeRefreshToken(session.refresh_token_id);

    // Log session revocation
    await auditLogger.logUserAction(
      'session_revoked',
      'session',
      {
        actorId: revokedBy,
        actorType: 'user',
        ipAddress: session.ip_address,
        userAgent: session.user_agent,
        sessionId: sessionId,
      },
      sessionId,
      { reason },
      'medium'
    );
  }

  // Revoke all user sessions except current
  async revokeAllOtherSessions(
    userId: string,
    currentSessionId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<number> {
    const sessions = await securityDb.getUserSessions(userId);
    const otherSessions = sessions.filter(s => s.id !== currentSessionId);
    
    let revokedCount = 0;
    for (const session of otherSessions) {
      await this.revokeSession(session.id, userId, 'revoke_all_other_sessions');
      revokedCount++;
    }

    // Log bulk session revocation
    if (revokedCount > 0) {
      await auditLogger.logUserAction(
        'bulk_session_revocation',
        'session',
        {
          actorId: userId,
          actorType: 'user',
          ipAddress,
          userAgent,
          sessionId: currentSessionId,
        },
        undefined,
        { revoked_count: revokedCount },
        'medium'
      );
    }

    return revokedCount;
  }

  // Check session validity
  async isSessionValid(sessionId: string): Promise<boolean> {
    const session = await securityDb.getSession(sessionId);
    
    if (!session || session.revoked_at) {
      return false;
    }

    // Check if session has expired
    if (new Date(session.expires_at) < new Date()) {
      await securityDb.revokeSession(sessionId);
      return false;
    }

    return true;
  }

  // Get session by refresh token
  async getSessionByRefreshToken(refreshTokenId: string): Promise<Session | null> {
    // Since we're using a mock database, we'll need to implement this differently
    // In a real implementation, we would query the database for sessions with this refresh token ID
    try {
      // This is a mock implementation - in a real database we would query sessions
      // For now, we'll return null since we don't have access to all sessions
      return null;
    } catch (error) {
      return null;
    }
  }

  // Detect concurrent sessions from different locations
  async detectConcurrentSessions(userId: string): Promise<{
    suspicious: boolean;
    details: {
      activeSessionsCount: number;
      uniqueIPs: string[];
      uniqueDevices: string[];
      suspiciousPatterns: string[];
    };
  }> {
    const sessions = await securityDb.getUserSessions(userId);
    const activeSessions = sessions.filter(s => !s.revoked_at);
    
    const uniqueIPs = [...new Set(activeSessions.map(s => s.ip_address))];
    const uniqueDevices = [...new Set(activeSessions.map(s => s.device_fingerprint))];
    
    const suspiciousPatterns: string[] = [];
    
    // Check for too many concurrent sessions
    if (activeSessions.length > 5) {
      suspiciousPatterns.push('High number of concurrent sessions');
    }
    
    // Check for sessions from different countries/regions
    if (uniqueIPs.length > 3) {
      suspiciousPatterns.push('Sessions from multiple IP addresses');
    }
    
    // Check for rapid session creation
    const recentSessions = activeSessions.filter(
      s => new Date(s.created_at) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );
    if (recentSessions.length > 3) {
      suspiciousPatterns.push('Multiple sessions created recently');
    }
    
    return {
      suspicious: suspiciousPatterns.length > 0,
      details: {
        activeSessionsCount: activeSessions.length,
        uniqueIPs,
        uniqueDevices,
        suspiciousPatterns,
      },
    };
  }

  // Clean up expired sessions
  async cleanupExpiredSessions(): Promise<number> {
    // Since we're using a mock database, we'll return 0
    // In a real implementation, we would query and clean up expired sessions
    return 0;
  }

  // Get session analytics
  async getSessionAnalytics(userId: string, days: number = 30): Promise<{
    totalSessions: number;
    averageSessionDuration: number;
    uniqueDevices: number;
    uniqueIPs: number;
    sessionsByDay: Array<{ date: string; count: number }>;
    topDevices: Array<{ device: string; count: number }>;
    topLocations: Array<{ location: string; count: number }>;
  }> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const sessions = await securityDb.getUserSessions(userId);
    const recentSessions = sessions.filter(
      s => new Date(s.created_at) > cutoffDate
    );
    
    // Calculate average session duration
    let totalDuration = 0;
    let validSessions = 0;
    
    recentSessions.forEach(session => {
      const endTime = session.revoked_at ? new Date(session.revoked_at) : new Date();
      const startTime = new Date(session.created_at);
      const duration = endTime.getTime() - startTime.getTime();
      if (duration > 0) {
        totalDuration += duration;
        validSessions++;
      }
    });
    
    const averageSessionDuration = validSessions > 0 ? totalDuration / validSessions : 0;
    
    // Group sessions by day
    const sessionsByDay: Record<string, number> = {};
    recentSessions.forEach(session => {
      const date = new Date(session.created_at).toISOString().split('T')[0];
      sessionsByDay[date] = (sessionsByDay[date] || 0) + 1;
    });
    
    // Count devices and locations
    const deviceCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    
    recentSessions.forEach(session => {
      const device = this.parseDeviceInfo(session).browser || 'Unknown';
      const location = this.formatLocation(session.ip_address);
      
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    return {
      totalSessions: recentSessions.length,
      averageSessionDuration: Math.round(averageSessionDuration / (1000 * 60)), // Convert to minutes
      uniqueDevices: Object.keys(deviceCounts).length,
      uniqueIPs: [...new Set(recentSessions.map(s => s.ip_address))].length,
      sessionsByDay: Object.entries(sessionsByDay).map(([date, count]) => ({ date, count })),
      topDevices: Object.entries(deviceCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([device, count]) => ({ device, count })),
      topLocations: Object.entries(locationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([location, count]) => ({ location, count })),
    };
  }

  // Parse device information from user agent
  private parseDeviceInfo(session: Session): DeviceInfo {
    const userAgent = session.user_agent;
    
    // Simple user agent parsing (in production, use a proper library)
    const browser = this.extractBrowser(userAgent);
    const os = this.extractOS(userAgent);
    const platform = this.extractPlatform(userAgent);
    
    return {
      fingerprint: session.device_fingerprint,
      userAgent: session.user_agent,
      ipAddress: session.ip_address,
      browser,
      os,
      platform,
    };
  }

  private extractBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private extractOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private extractPlatform(userAgent: string): string {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return 'Mobile';
    }
    if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      return 'Tablet';
    }
    return 'Desktop';
  }

  private formatLocation(ipAddress: string): string {
    // In production, use GeoIP service to get actual location
    // For now, return IP address
    return ipAddress;
  }
}

// Singleton instance
export const sessionManager = new SessionManager();