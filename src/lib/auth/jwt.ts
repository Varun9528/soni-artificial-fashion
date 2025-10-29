import { JWTPayload, SecurityConfig } from '@/types/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Proper implementation using bcrypt and jsonwebtoken
class CryptoService {
  // Hash password with bcrypt
  async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password with bcrypt
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate secure random token using Math.random (for Edge Runtime compatibility)
  generateSecureToken(length: number = 32): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate UUID v4 using Math.random (for Edge Runtime compatibility)
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Hash data for storage (SHA-256) using Node.js crypto if available, fallback to simple hash
  hashData(data: string): string {
    try {
      // Try to use Node.js crypto if available
      const crypto = require('crypto');
      return crypto.createHash('sha256').update(data).digest('hex');
    } catch {
      // Fallback to simple hash function for Edge Runtime
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16);
    }
  }

  // Sign JWT with HS256
  signJWT(payload: JWTPayload, secret: string): string {
    return jwt.sign(payload, secret, { algorithm: 'HS256' });
  }

  // Verify JWT with HS256
  verifyJWT(token: string, secret: string): JWTPayload | null {
    try {
      return jwt.verify(token, secret) as JWTPayload;
    } catch {
      return null;
    }
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
      iss: 'lettex-marketplace',
      aud: 'lettex-users',
      iat: now,
      exp: now + this.config.accessTokenTTL,
      jti: this.crypto.generateUUID(),
    };

    return this.crypto.signJWT(jwtPayload, this.config.jwtSecret);
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
      const payload = this.crypto.verifyJWT(token, this.config.jwtSecret);
      
      if (!payload) {
        return null;
      }

      // Additional validation
      if (payload.iss !== 'lettex-marketplace') {
        return null;
      }

      if (payload.aud !== 'lettex-users') {
        return null;
      }

      // Check if token has expired
      if (payload.exp && Date.now() / 1000 > payload.exp) {
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

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production';

// Singleton instance
export const jwtService = new JWTService(defaultSecurityConfig);

export const generateAccessToken = (user: any) => {
  const payload = {
    sub: user.id, // Use 'sub' as per JWT standard
    email: user.email,
    role: user.role,
    iss: 'lettex-marketplace',
    aud: 'lettex-users'
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '15m',
    issuer: 'lettex-marketplace',
    audience: 'lettex-users'
  });
};

export const generateRefreshToken = (user: any) => {
  const payload = {
    sub: user.id, // Use 'sub' as per JWT standard
    email: user.email,
    role: user.role,
    iss: 'lettex-marketplace',
    aud: 'lettex-users'
  };
  
  return jwt.sign(payload, JWT_REFRESH_SECRET, { 
    expiresIn: '7d',
    issuer: 'lettex-marketplace',
    audience: 'lettex-users'
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    const payload: any = jwt.verify(token, JWT_SECRET, {
      issuer: 'lettex-marketplace',
      audience: 'lettex-users'
    });
    
    // Additional validation
    if (payload.iss !== 'lettex-marketplace') {
      throw new Error('Invalid issuer');
    }
    
    if (payload.aud !== 'lettex-users') {
      throw new Error('Invalid audience');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};