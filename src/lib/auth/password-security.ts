import { PasswordPolicy, User, SecurityEvent } from '@/types/auth';
import { securityDb } from '@/lib/database/security';
import { jwtService } from '@/lib/auth/jwt';

export class PasswordSecurityService {
  private passwordPolicy: PasswordPolicy;

  constructor(passwordPolicy: PasswordPolicy) {
    this.passwordPolicy = passwordPolicy;
  }

  // Validate password against policy
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.passwordPolicy.minLength) {
      errors.push(`Password must be at least ${this.passwordPolicy.minLength} characters long`);
    }

    if (this.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.passwordPolicy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (this.passwordPolicy.requireSymbols && !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak patterns
    if (this.isCommonPassword(password)) {
      errors.push('Password is too common and easily guessable');
    }

    if (this.hasSequentialCharacters(password)) {
      errors.push('Password cannot contain sequential characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Check if password has been used before
  async checkPasswordReuse(userId: string, newPassword: string): Promise<boolean> {
    if (this.passwordPolicy.preventReuse === 0) {
      return false; // No reuse checking
    }

    const passwordHistory = await securityDb.getPasswordHistory(userId);
    
    for (const oldPasswordHash of passwordHistory.slice(0, this.passwordPolicy.preventReuse)) {
      if (await jwtService.verifyPassword(newPassword, oldPasswordHash)) {
        return true; // Password has been used before
      }
    }

    return false;
  }

  // Change user password with security checks
  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await securityDb.getUserById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      if (!(await jwtService.verifyPassword(currentPassword, user.password_hash))) {
        await this.logSecurityEvent(userId, 'failed_password_change', ipAddress, userAgent, {
          reason: 'invalid_current_password'
        });
        return { success: false, error: 'Current password is incorrect' };
      }

      // Validate new password
      const validation = this.validatePassword(newPassword);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Check password reuse
      if (await this.checkPasswordReuse(userId, newPassword)) {
        return { success: false, error: 'Cannot reuse a recent password' };
      }

      // Hash and update password
      const newPasswordHash = await jwtService.hashPassword(newPassword);
      await securityDb.updateUser(userId, {
        password_hash: newPasswordHash,
        password_changed_at: new Date().toISOString(),
      });

      // Add to password history
      await securityDb.addPasswordToHistory(userId, newPasswordHash);

      // Log security event
      await this.logSecurityEvent(userId, 'password_changed', ipAddress, userAgent, {
        forced: false
      });

      // Revoke all refresh tokens to force re-login
      await securityDb.revokeAllUserTokens(userId);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to change password' };
    }
  }

  // Force password change (admin action)
  async forcePasswordChange(
    adminId: string,
    targetUserId: string,
    newPassword: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate new password
      const validation = this.validatePassword(newPassword);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Hash and update password
      const newPasswordHash = await jwtService.hashPassword(newPassword);
      await securityDb.updateUser(targetUserId, {
        password_hash: newPasswordHash,
        password_changed_at: new Date().toISOString(),
      });

      // Add to password history
      await securityDb.addPasswordToHistory(targetUserId, newPasswordHash);

      // Log security event
      await this.logSecurityEvent(targetUserId, 'password_forced_change', ipAddress, userAgent, {
        forced_by: adminId
      });

      // Revoke all refresh tokens
      await securityDb.revokeAllUserTokens(targetUserId);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to force password change' };
    }
  }

  // Check if password is expired
  async isPasswordExpired(user: User): Promise<boolean> {
    if (this.passwordPolicy.maxAge === 0) {
      return false; // No expiry
    }

    const passwordAge = Date.now() - new Date(user.password_changed_at).getTime();
    const maxAgeMs = this.passwordPolicy.maxAge * 24 * 60 * 60 * 1000;
    
    return passwordAge > maxAgeMs;
  }

  // Check account lockout status
  async checkAccountLockout(user: User): Promise<{ locked: boolean; unlockTime?: Date }> {
    if (!user.locked_until) {
      return { locked: false };
    }

    const unlockTime = new Date(user.locked_until);
    const now = new Date();

    if (now >= unlockTime) {
      // Unlock the account
      await securityDb.updateUser(user.id, {
        locked_until: undefined,
        failed_login_attempts: 0,
      });
      return { locked: false };
    }

    return { locked: true, unlockTime };
  }

  // Handle failed login attempt
  async handleFailedLogin(
    email: string,
    ipAddress: string,
    userAgent: string,
    reason: string
  ): Promise<{ accountLocked: boolean; attemptsRemaining?: number }> {
    const user = await securityDb.getUserByEmail(email);
    
    // Record login attempt
    await securityDb.recordLoginAttempt({
      email,
      ip_address: ipAddress,
      user_agent: userAgent,
      success: false,
      failure_reason: reason,
      timestamp: new Date().toISOString(),
    });

    if (!user) {
      return { accountLocked: false };
    }

    const newFailedAttempts = user.failed_login_attempts + 1;
    const maxAttempts = 5; // From security config

    if (newFailedAttempts >= maxAttempts) {
      // Lock the account
      const lockoutDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
      const lockedUntil = new Date(Date.now() + lockoutDuration).toISOString();

      await securityDb.updateUser(user.id, {
        failed_login_attempts: newFailedAttempts,
        locked_until: lockedUntil,
      });

      await this.logSecurityEvent(user.id, 'account_locked', ipAddress, userAgent, {
        failed_attempts: newFailedAttempts,
        locked_until: lockedUntil,
      });

      return { accountLocked: true };
    } else {
      // Increment failed attempts
      await securityDb.updateUser(user.id, {
        failed_login_attempts: newFailedAttempts,
      });

      return {
        accountLocked: false,
        attemptsRemaining: maxAttempts - newFailedAttempts,
      };
    }
  }

  // Handle successful login
  async handleSuccessfulLogin(user: User, ipAddress: string, userAgent: string): Promise<void> {
    // Reset failed login attempts
    await securityDb.updateUser(user.id, {
      failed_login_attempts: 0,
      locked_until: undefined,
      last_login_at: new Date().toISOString(),
    });

    // Record successful login attempt
    await securityDb.recordLoginAttempt({
      email: user.email,
      ip_address: ipAddress,
      user_agent: userAgent,
      success: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Private helper methods
  private isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      'dragon', 'password1', '123123', 'sunshine', 'master',
    ];
    
    return commonPasswords.some(common => 
      password.toLowerCase().includes(common.toLowerCase())
    );
  }

  private hasSequentialCharacters(password: string): boolean {
    const sequences = [
      'abcdefghijklmnopqrstuvwxyz',
      '0123456789',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
    ];

    for (const sequence of sequences) {
      for (let i = 0; i <= sequence.length - 3; i++) {
        const substr = sequence.substring(i, i + 3);
        if (password.toLowerCase().includes(substr)) {
          return true;
        }
      }
    }

    return false;
  }

  private async logSecurityEvent(
    userId: string,
    eventType: SecurityEvent['event_type'],
    ipAddress: string,
    userAgent: string,
    details: object
  ): Promise<void> {
    await securityDb.createSecurityEvent({
      user_id: userId,
      event_type: eventType,
      ip_address: ipAddress,
      user_agent: userAgent,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}

// Default password policy
export const defaultPasswordPolicy: PasswordPolicy = {
  minLength: 10,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  preventReuse: 5,
  maxAge: 90, // days
};

// Singleton instance
export const passwordSecurityService = new PasswordSecurityService(defaultPasswordPolicy);