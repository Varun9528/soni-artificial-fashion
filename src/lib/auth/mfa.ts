import { securityDb } from '@/lib/database/security';
import { jwtService } from '@/lib/auth/jwt';

export class MFAService {
  // Generate a secret for TOTP (mock implementation)
  generateSecret(): string {
    // In production, use a proper crypto library
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Generate a TOTP URI for QR code generation (mock implementation)
  generateTotpUri(secret: string, email: string, issuer: string = 'Pachmarhi Tribal Art'): string {
    return `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
  }

  // Generate QR code for TOTP setup (mock implementation)
  async generateQrCode(totpUri: string): Promise<string> {
    // In production, use a QR code library
    // For now, return a placeholder
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNjY2NjY2MiLz48L3N2Zz4=`;
  }

  // Verify TOTP token (mock implementation)
  verifyToken(secret: string, token: string): boolean {
    // In production, use a proper TOTP library
    // For now, return true for demo purposes
    return token.length === 6 && /^\d+$/.test(token);
  }

  // Generate backup codes
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric backup codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  // Hash backup codes for storage
  async hashBackupCode(code: string): Promise<string> {
    // In production, use bcrypt or similar
    return `hashed_${code}`;
  }

  // Verify backup code (for code verification)
  async verifyBackupCodeHash(providedCode: string, hashedCode: string): Promise<boolean> {
    // In production, use bcrypt.compare
    return hashedCode === `hashed_${providedCode}`;
  }

  // Setup MFA for user
  async setupMFA(
    userId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ secret: string; qrCodeData: string; backupCodes: string[] }> {
    const user = await securityDb.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.mfa_enabled) {
      throw new Error('MFA is already enabled for this user');
    }

    // Generate secret
    const secret = this.generateSecret();
    
    // Generate QR code data
    const qrCodeData = this.generateTotpUri(secret, user.email);
    
    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Store secret temporarily (not yet enabled)
    await securityDb.updateUser(userId, {
      mfa_secret: secret,
    });

    // Log security event
    await securityDb.createSecurityEvent({
      user_id: userId,
      event_type: 'mfa_enabled',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: {
        step: 'setup_initiated',
      },
      timestamp: new Date().toISOString(),
    });

    return {
      secret,
      qrCodeData,
      backupCodes,
    };
  }

  // Verify and enable MFA
  async enableMFA(
    userId: string,
    token: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ success: boolean; error?: string }> {
    const user = await securityDb.getUserById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.mfa_enabled) {
      return { success: false, error: 'MFA is already enabled' };
    }

    if (!user.mfa_secret) {
      return { success: false, error: 'MFA setup not initiated' };
    }

    // Verify token
    const isValid = this.verifyToken(user.mfa_secret, token);
    if (!isValid) {
      return { success: false, error: 'Invalid verification code' };
    }

    // Enable MFA
    await securityDb.updateUser(userId, {
      mfa_enabled: true,
    });

    // Log security event
    await securityDb.createSecurityEvent({
      user_id: userId,
      event_type: 'mfa_enabled',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: {
        step: 'enabled',
      },
      timestamp: new Date().toISOString(),
    });

    // Log audit event
    await securityDb.createAuditLog({
      actor_id: userId,
      actor_type: 'user',
      action: 'mfa_enabled',
      target_type: 'user',
      target_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      severity: 'medium',
    });

    return { success: true };
  }

  // Disable MFA
  async disableMFA(
    userId: string,
    token: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ success: boolean; error?: string }> {
    const user = await securityDb.getUserById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.mfa_enabled || !user.mfa_secret) {
      return { success: false, error: 'MFA is not enabled' };
    }

    // Verify token
    const isValid = this.verifyToken(user.mfa_secret, token);
    if (!isValid) {
      return { success: false, error: 'Invalid verification code' };
    }

    // Disable MFA
    await securityDb.updateUser(userId, {
      mfa_enabled: false,
      mfa_secret: undefined,
    });

    // Log security event
    await securityDb.createSecurityEvent({
      user_id: userId,
      event_type: 'mfa_disabled',
      ip_address: ipAddress,
      user_agent: userAgent,
      details: {},
      timestamp: new Date().toISOString(),
    });

    // Log audit event
    await securityDb.createAuditLog({
      actor_id: userId,
      actor_type: 'user',
      action: 'mfa_disabled',
      target_type: 'user',
      target_id: userId,
      ip_address: ipAddress,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      severity: 'high', // High severity as this reduces security
    });

    return { success: true };
  }

  // Verify MFA token during login
  async verifyMFAToken(
    userId: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> {
    const user = await securityDb.getUserById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.mfa_enabled || !user.mfa_secret) {
      return { success: false, error: 'MFA is not enabled for this user' };
    }

    // Verify token
    const isValid = this.verifyToken(user.mfa_secret, token);
    if (!isValid) {
      return { success: false, error: 'Invalid verification code' };
    }

    return { success: true };
  }

  // Check if user has MFA enabled
  async isMFAEnabled(userId: string): Promise<boolean> {
    const user = await securityDb.getUserById(userId);
    return user?.mfa_enabled || false;
  }

  // Verify backup code (for user login)
  async verifyBackupCode(
    userId: string,
    backupCode: string
  ): Promise<{ success: boolean; error?: string }> {
    // In production, store hashed backup codes in database
    // and verify against them, marking used codes as consumed
    return { success: false, error: 'Backup codes not implemented' };
  }

  // Get MFA status for user
  async getMFAStatus(userId: string): Promise<{
    enabled: boolean;
    hasSecret: boolean;
    backupCodesRemaining?: number;
  }> {
    const user = await securityDb.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      enabled: user.mfa_enabled,
      hasSecret: !!user.mfa_secret,
      backupCodesRemaining: 0, // Would query from backup codes table
    };
  }
}

// Singleton instance
export const mfaService = new MFAService();