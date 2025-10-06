import { User, RefreshToken, Session, AuditLog, SecurityEvent, VerificationToken, LoginAttempt } from '@/types/auth';

// In-memory database simulation for development
// In production, replace with proper database (PostgreSQL, MySQL, etc.)
class SecurityDatabase {
  private users: Map<string, User> = new Map();
  private refreshTokens: Map<string, RefreshToken> = new Map();
  private sessions: Map<string, Session> = new Map();
  private auditLogs: AuditLog[] = [];
  private securityEvents: SecurityEvent[] = [];
  private verificationTokens: Map<string, VerificationToken> = new Map();
  private loginAttempts: LoginAttempt[] = [];
  private passwordHistory: Map<string, string[]> = new Map();

  // User operations
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const id = this.generateId();
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id,
      created_at: now,
      updated_at: now,
      failed_login_attempts: 0,
      mfa_enabled: false,
      password_changed_at: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Refresh token operations
  async createRefreshToken(token: Omit<RefreshToken, 'id'>): Promise<RefreshToken> {
    const id = this.generateId();
    const newToken: RefreshToken = { ...token, id };
    this.refreshTokens.set(id, newToken);
    return newToken;
  }

  async getRefreshToken(jti: string): Promise<RefreshToken | null> {
    for (const token of this.refreshTokens.values()) {
      if (token.jti === jti && !token.revoked_at) {
        return token;
      }
    }
    return null;
  }

  async revokeRefreshToken(jti: string): Promise<boolean> {
    for (const [id, token] of this.refreshTokens.entries()) {
      if (token.jti === jti) {
        token.revoked_at = new Date().toISOString();
        this.refreshTokens.set(id, token);
        return true;
      }
    }
    return false;
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    for (const [id, token] of this.refreshTokens.entries()) {
      if (token.user_id === userId) {
        token.revoked_at = new Date().toISOString();
        this.refreshTokens.set(id, token);
      }
    }
  }

  async cleanExpiredTokens(): Promise<void> {
    const now = new Date();
    for (const [id, token] of this.refreshTokens.entries()) {
      if (new Date(token.expires_at) < now) {
        this.refreshTokens.delete(id);
      }
    }
  }

  // Session operations
  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    const id = this.generateId();
    const newSession: Session = { ...session, id };
    this.sessions.set(id, newSession);
    return newSession;
  }

  async getSession(id: string): Promise<Session | null> {
    return this.sessions.get(id) || null;
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    const sessions: Session[] = [];
    for (const session of this.sessions.values()) {
      if (session.user_id === userId && !session.revoked_at) {
        sessions.push(session);
      }
    }
    return sessions;
  }

  async revokeSession(id: string): Promise<boolean> {
    const session = this.sessions.get(id);
    if (session) {
      session.revoked_at = new Date().toISOString();
      this.sessions.set(id, session);
      return true;
    }
    return false;
  }

  async updateSessionActivity(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (session) {
      session.last_active_at = new Date().toISOString();
      this.sessions.set(id, session);
    }
  }

  // Audit log operations
  async createAuditLog(log: Omit<AuditLog, 'id'>): Promise<AuditLog> {
    const id = this.generateId();
    const newLog: AuditLog = { ...log, id };
    this.auditLogs.push(newLog);
    return newLog;
  }

  async getAuditLogs(filters?: {
    actor_id?: string;
    action?: string;
    target_type?: string;
    fromDate?: string;
    toDate?: string;
    severity?: string;
  }): Promise<AuditLog[]> {
    let logs = [...this.auditLogs];
    
    if (filters) {
      if (filters.actor_id) {
        logs = logs.filter(log => log.actor_id === filters.actor_id);
      }
      if (filters.action) {
        logs = logs.filter(log => log.action === filters.action);
      }
      if (filters.target_type) {
        logs = logs.filter(log => log.target_type === filters.target_type);
      }
      if (filters.fromDate) {
        logs = logs.filter(log => log.timestamp >= filters.fromDate!);
      }
      if (filters.toDate) {
        logs = logs.filter(log => log.timestamp <= filters.toDate!);
      }
      if (filters.severity) {
        logs = logs.filter(log => log.severity === filters.severity);
      }
    }
    
    return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  // Security event operations
  async createSecurityEvent(event: Omit<SecurityEvent, 'id'>): Promise<SecurityEvent> {
    const id = this.generateId();
    const newEvent: SecurityEvent = { ...event, id };
    this.securityEvents.push(newEvent);
    return newEvent;
  }

  async getSecurityEvents(userId?: string): Promise<SecurityEvent[]> {
    let events = [...this.securityEvents];
    if (userId) {
      events = events.filter(event => event.user_id === userId);
    }
    return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  // Verification token operations
  async createVerificationToken(token: Omit<VerificationToken, 'id'>): Promise<VerificationToken> {
    const id = this.generateId();
    const newToken: VerificationToken = { ...token, id };
    this.verificationTokens.set(token.token, newToken);
    return newToken;
  }

  async getVerificationToken(token: string): Promise<VerificationToken | null> {
    const verificationToken = this.verificationTokens.get(token);
    if (verificationToken && !verificationToken.used_at && new Date(verificationToken.expires_at) > new Date()) {
      return verificationToken;
    }
    return null;
  }

  async markTokenUsed(token: string): Promise<boolean> {
    const verificationToken = this.verificationTokens.get(token);
    if (verificationToken) {
      verificationToken.used_at = new Date().toISOString();
      this.verificationTokens.set(token, verificationToken);
      return true;
    }
    return false;
  }

  // Login attempt tracking
  async recordLoginAttempt(attempt: Omit<LoginAttempt, 'id'>): Promise<LoginAttempt> {
    const id = this.generateId();
    const newAttempt: LoginAttempt = { ...attempt, id };
    this.loginAttempts.push(newAttempt);
    
    // Keep only last 1000 attempts to prevent memory issues
    if (this.loginAttempts.length > 1000) {
      this.loginAttempts = this.loginAttempts.slice(-1000);
    }
    
    return newAttempt;
  }

  async getRecentFailedAttempts(email: string, windowMinutes: number = 15): Promise<LoginAttempt[]> {
    const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
    return this.loginAttempts.filter(
      attempt => attempt.email === email && 
                !attempt.success && 
                attempt.timestamp > cutoff
    );
  }

  async getRecentFailedAttemptsByIP(ip: string, windowMinutes: number = 15): Promise<LoginAttempt[]> {
    const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
    return this.loginAttempts.filter(
      attempt => attempt.ip_address === ip && 
                !attempt.success && 
                attempt.timestamp > cutoff
    );
  }

  // Password history
  async addPasswordToHistory(userId: string, passwordHash: string): Promise<void> {
    const history = this.passwordHistory.get(userId) || [];
    history.unshift(passwordHash);
    
    // Keep only last 5 passwords
    if (history.length > 5) {
      history.splice(5);
    }
    
    this.passwordHistory.set(userId, history);
  }

  async getPasswordHistory(userId: string): Promise<string[]> {
    return this.passwordHistory.get(userId) || [];
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Database maintenance
  async cleanup(): Promise<void> {
    await this.cleanExpiredTokens();
    
    // Clean old audit logs (keep last 10000)
    if (this.auditLogs.length > 10000) {
      this.auditLogs = this.auditLogs.slice(-10000);
    }
    
    // Clean old security events (keep last 5000)
    if (this.securityEvents.length > 5000) {
      this.securityEvents = this.securityEvents.slice(-5000);
    }
    
    // Clean expired verification tokens
    const now = new Date();
    for (const [token, verificationToken] of this.verificationTokens.entries()) {
      if (new Date(verificationToken.expires_at) < now) {
        this.verificationTokens.delete(token);
      }
    }
  }
}

// Singleton instance
export const securityDb = new SecurityDatabase();