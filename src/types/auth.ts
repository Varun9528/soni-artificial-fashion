// Authentication and security types
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'support' | 'artisan' | 'customer';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: UserRole;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  failed_login_attempts: number;
  locked_until?: string;
  mfa_enabled: boolean;
  mfa_secret?: string;
  password_changed_at: string;
}

export interface RefreshToken {
  id: string;
  jti: string;
  user_id: string;
  token_hash: string;
  device_info: string;
  ip_address: string;
  user_agent: string;
  issued_at: string;
  expires_at: string;
  revoked_at?: string;
  last_used_at?: string;
}

export interface Session {
  id: string;
  user_id: string;
  refresh_token_id: string;
  device_fingerprint: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_active_at: string;
  expires_at: string;
  revoked_at?: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_type: 'user' | 'system';
  action: string;
  target_type: string;
  target_id?: string;
  changes?: object;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: 'failed_login' | 'account_locked' | 'password_reset' | 'mfa_disabled' | 'suspicious_activity' | 'password_changed' | 'failed_password_change' | 'password_forced_change' | 'mfa_enabled' | 'session_created' | 'session_revoked';
  ip_address: string;
  user_agent: string;
  details: object;
  timestamp: string;
  resolved_at?: string;
}

export interface VerificationToken {
  id: string;
  user_id: string;
  token: string;
  type: 'email_verification' | 'password_reset' | 'mfa_setup';
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface JWTPayload {
  sub: string; // user id
  iss: string; // issuer
  aud: string; // audience
  iat: number; // issued at
  exp: number; // expiry
  jti: string; // unique token id
  role: UserRole;
  permissions?: string[];
  tenant?: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  failure_reason?: string;
  timestamp: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  preventReuse: number; // number of previous passwords to check
  maxAge: number; // days before password expires
}

export interface RateLimitRule {
  endpoint: string;
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtPublicKey?: string;
  jwtPrivateKey?: string;
  accessTokenTTL: number; // seconds
  refreshTokenTTL: number; // seconds
  passwordPolicy: PasswordPolicy;
  rateLimits: RateLimitRule[];
  mfaIssuer: string;
  emailVerificationTTL: number; // seconds
  passwordResetTTL: number; // seconds
  maxFailedAttempts: number;
  lockoutDuration: number; // seconds
  sessionTimeout: number; // seconds
}