import { JWTPayload, SecurityConfig } from '@/types/auth';

// Mock implementation of crypto functions for development
// In production, use proper crypto libraries
class CryptoService {
  // Generate RSA key pair (mock implementation)
  generateKeyPair(): { publicKey: string; privateKey: string } {
    // In production, use node:crypto or jose library
    return {
      publicKey: 'mock-public-key',
      privateKey: 'mock-private-key'
    };
  }

  // Sign JWT with RS256 (mock implementation)
  signJWT(payload: JWTPayload, privateKey: string): string {
    // In production, use jsonwebtoken or jose library
    const header = { alg: 'RS256', typ: 'JWT' };
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signature = this.mockSign(`${encodedHeader}.${encodedPayload}`, privateKey);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  // Verify JWT with RS256 (mock implementation)
  verifyJWT(token: string, publicKey: string): JWTPayload | null {
    try {
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(this.base64UrlDecode(payload));
      
      // In production, verify signature with public key
      const expectedSignature = this.mockSign(`${header}.${payload}`, 'mock-private-key');
      if (signature !== expectedSignature) {
        return null;
      }
      
      // Check expiry
      if (decodedPayload.exp && Date.now() / 1000 > decodedPayload.exp) {
        return null;
      }
      
      return decodedPayload;
    } catch {
      return null;
    }
  }

  // Hash password with bcrypt (mock implementation)
  async hashPassword(password: string): Promise<string> {
    // In production, use bcryptjs
    return `hashed:${password}:salt`;
  }

  // Verify password with bcrypt (mock implementation)
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    // In production, use bcryptjs.compare
    return hash === `hashed:${password}:salt`;
  }

  // Generate secure random token
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate UUID v4
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Hash data for storage (SHA-256)
  hashData(data: string): string {
    // In production, use crypto.createHash('sha256')
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Helper methods
  private base64UrlEncode(str: string): string {
    return Buffer.from(str).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private base64UrlDecode(str: string): string {
    str += '='.repeat((4 - str.length % 4) % 4);
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
  }

  private mockSign(data: string, key: string): string {
    // Simple mock signature - in production use proper crypto
    let hash = 0;
    const combined = data + key;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

export class JWTService {
  private crypto = new CryptoService();
  private config: SecurityConfig;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  // Generate access token
  generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti'>): string {
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + this.config.accessTokenTTL,
      jti: this.crypto.generateUUID(),
    };

    return this.crypto.signJWT(jwtPayload, this.config.jwtPrivateKey || this.config.jwtSecret);
  }

  // Generate refresh token
  generateRefreshToken(): { token: string; jti: string } {
    const jti = this.crypto.generateUUID();
    const token = this.crypto.generateSecureToken(64);
    return { token, jti };
  }

  // Verify access token
  verifyAccessToken(token: string): JWTPayload | null {
    try {
      const payload = this.crypto.verifyJWT(token, this.config.jwtPublicKey || this.config.jwtSecret);
      
      if (!payload) {
        return null;
      }

      // Additional validation
      if (payload.iss !== 'pachmarhi-marketplace') {
        return null;
      }

      if (payload.aud !== 'pachmarhi-users') {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  // Hash refresh token for storage
  hashRefreshToken(token: string): string {
    return this.crypto.hashData(token);
  }

  // Verify refresh token hash
  verifyRefreshTokenHash(token: string, hash: string): boolean {
    return this.crypto.hashData(token) === hash;
  }

  // Generate verification token
  generateVerificationToken(): string {
    return this.crypto.generateSecureToken(48);
  }

  // Generate MFA secret
  generateMFASecret(): string {
    return this.crypto.generateSecureToken(32);
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return this.crypto.hashPassword(password);
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.crypto.verifyPassword(password, hash);
  }

  // Extract token from Authorization header
  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  // Check if token is blacklisted (placeholder for future implementation)
  async isTokenBlacklisted(jti: string): Promise<boolean> {
    // In production, check against a blacklist store (Redis, etc.)
    return false;
  }

  // Add token to blacklist (placeholder for future implementation)
  async blacklistToken(jti: string, exp: number): Promise<void> {
    // In production, add to blacklist store with TTL
    console.log(`Token ${jti} blacklisted until ${new Date(exp * 1000)}`);
  }
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  accessTokenTTL: 15 * 60, // 15 minutes
  refreshTokenTTL: 14 * 24 * 60 * 60, // 14 days
  passwordPolicy: {
    minLength: 10,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventReuse: 5,
    maxAge: 90, // days
  },
  rateLimits: [
    {
      endpoint: '/api/auth/login',
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      skipSuccessfulRequests: true,
    },
    {
      endpoint: '/api/auth/register',
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
    },
    {
      endpoint: '/api/auth/request-password-reset',
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
    },
  ],
  mfaIssuer: 'Pachmarhi Tribal Art',
  emailVerificationTTL: 24 * 60 * 60, // 24 hours
  passwordResetTTL: 60 * 60, // 1 hour
  maxFailedAttempts: 5,
  lockoutDuration: 30 * 60, // 30 minutes
  sessionTimeout: 30 * 24 * 60 * 60, // 30 days
};

// Singleton instance
export const jwtService = new JWTService(defaultSecurityConfig);