import { NextRequest, NextResponse } from 'next/server';

// Security headers configuration
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: {
    enabled: boolean;
    directives: Record<string, string[]>;
  };
  strictTransportSecurity?: {
    enabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  xFrameOptions?: {
    enabled: boolean;
    value: 'DENY' | 'SAMEORIGIN' | string;
  };
  xContentTypeOptions?: {
    enabled: boolean;
  };
  referrerPolicy?: {
    enabled: boolean;
    value: string;
  };
  permissionsPolicy?: {
    enabled: boolean;
    directives: Record<string, string[]>;
  };
  crossOriginEmbedderPolicy?: {
    enabled: boolean;
    value: 'require-corp' | 'unsafe-none';
  };
  crossOriginOpenerPolicy?: {
    enabled: boolean;
    value: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none';
  };
  crossOriginResourcePolicy?: {
    enabled: boolean;
    value: 'same-site' | 'same-origin' | 'cross-origin';
  };
}

// Default security headers configuration
export const defaultSecurityConfig: SecurityHeadersConfig = {
  contentSecurityPolicy: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'connect-src': ["'self'", 'https://api.pachmarhi-art.com'],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    },
  },
  strictTransportSecurity: {
    enabled: true,
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  xFrameOptions: {
    enabled: true,
    value: 'DENY',
  },
  xContentTypeOptions: {
    enabled: true,
  },
  referrerPolicy: {
    enabled: true,
    value: 'strict-origin-when-cross-origin',
  },
  permissionsPolicy: {
    enabled: true,
    directives: {
      'camera': [],
      'microphone': [],
      'geolocation': [],
      'payment': ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: {
    enabled: false, // Disabled by default as it can break functionality
    value: 'unsafe-none',
  },
  crossOriginOpenerPolicy: {
    enabled: true,
    value: 'same-origin',
  },
  crossOriginResourcePolicy: {
    enabled: true,
    value: 'same-site',
  },
};

export class SecurityHeadersService {
  private config: SecurityHeadersConfig;

  constructor(config: SecurityHeadersConfig = defaultSecurityConfig) {
    this.config = config;
  }

  // Apply security headers to response
  applySecurityHeaders(response: NextResponse): NextResponse {
    // Content Security Policy
    if (this.config.contentSecurityPolicy?.enabled) {
      const csp = this.buildCSP(this.config.contentSecurityPolicy.directives);
      response.headers.set('Content-Security-Policy', csp);
    }

    // Strict Transport Security
    if (this.config.strictTransportSecurity?.enabled) {
      const hsts = this.buildHSTS(this.config.strictTransportSecurity);
      response.headers.set('Strict-Transport-Security', hsts);
    }

    // X-Frame-Options
    if (this.config.xFrameOptions?.enabled) {
      response.headers.set('X-Frame-Options', this.config.xFrameOptions.value);
    }

    // X-Content-Type-Options
    if (this.config.xContentTypeOptions?.enabled) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
    }

    // Referrer Policy
    if (this.config.referrerPolicy?.enabled) {
      response.headers.set('Referrer-Policy', this.config.referrerPolicy.value);
    }

    // Permissions Policy
    if (this.config.permissionsPolicy?.enabled) {
      const pp = this.buildPermissionsPolicy(this.config.permissionsPolicy.directives);
      response.headers.set('Permissions-Policy', pp);
    }

    // Cross-Origin Embedder Policy
    if (this.config.crossOriginEmbedderPolicy?.enabled) {
      response.headers.set('Cross-Origin-Embedder-Policy', this.config.crossOriginEmbedderPolicy.value);
    }

    // Cross-Origin Opener Policy
    if (this.config.crossOriginOpenerPolicy?.enabled) {
      response.headers.set('Cross-Origin-Opener-Policy', this.config.crossOriginOpenerPolicy.value);
    }

    // Cross-Origin Resource Policy
    if (this.config.crossOriginResourcePolicy?.enabled) {
      response.headers.set('Cross-Origin-Resource-Policy', this.config.crossOriginResourcePolicy.value);
    }

    // Additional security headers
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');

    return response;
  }

  // Build CSP header value
  private buildCSP(directives: Record<string, string[]>): string {
    return Object.entries(directives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  // Build HSTS header value
  private buildHSTS(config: NonNullable<SecurityHeadersConfig['strictTransportSecurity']>): string {
    let hsts = `max-age=${config.maxAge}`;
    if (config.includeSubDomains) {
      hsts += '; includeSubDomains';
    }
    if (config.preload) {
      hsts += '; preload';
    }
    return hsts;
  }

  // Build Permissions Policy header value
  private buildPermissionsPolicy(directives: Record<string, string[]>): string {
    return Object.entries(directives)
      .map(([directive, sources]) => {
        if (sources.length === 0) {
          return `${directive}=()`;
        }
        return `${directive}=(${sources.join(' ')})`;
      })
      .join(', ');
  }

  // Validate if request is over HTTPS
  isHTTPS(request: NextRequest): boolean {
    const protocol = request.headers.get('x-forwarded-proto') || 
                    request.nextUrl.protocol;
    return protocol === 'https:';
  }

  // Enforce HTTPS redirect
  enforceHTTPS(request: NextRequest): NextResponse | null {
    if (!this.isHTTPS(request)) {
      const httpsUrl = new URL(request.url);
      httpsUrl.protocol = 'https:';
      return NextResponse.redirect(httpsUrl, 301);
    }
    return null;
  }

  // Check for common security vulnerabilities in headers
  checkSecurityVulnerabilities(request: NextRequest): string[] {
    const vulnerabilities: string[] = [];

    // Check for X-Forwarded-For header manipulation
    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor && this.containsSuspiciousValues(xForwardedFor)) {
      vulnerabilities.push('Suspicious X-Forwarded-For header detected');
    }

    // Check User-Agent
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || this.isSuspiciousUserAgent(userAgent)) {
      vulnerabilities.push('Suspicious or missing User-Agent header');
    }

    // Check for potential bot traffic
    if (this.isPotentialBot(request)) {
      vulnerabilities.push('Potential bot traffic detected');
    }

    return vulnerabilities;
  }

  // Check for suspicious values in headers
  private containsSuspiciousValues(value: string): boolean {
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /<.*>/,
      /\bon\w+\s*=/i,
      /eval\(/i,
      /expression\(/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(value));
  }

  // Check for suspicious User-Agent
  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /curl/i,
      /wget/i,
      /python/i,
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
    ];

    // Allow legitimate bots (Google, Bing, etc.)
    const legitimateBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    const isLegitimate = legitimateBots.some(pattern => pattern.test(userAgent));

    return isSuspicious && !isLegitimate;
  }

  // Detect potential bot traffic
  private isPotentialBot(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer');
    const acceptLanguage = request.headers.get('accept-language');

    // Check for missing common headers
    if (!referer && !acceptLanguage) {
      return true;
    }

    // Check for automation patterns
    if (userAgent.includes('HeadlessChrome') || 
        userAgent.includes('PhantomJS') || 
        userAgent.includes('selenium')) {
      return true;
    }

    return false;
  }
}

// Middleware to apply security headers
export function withSecurityHeaders(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  const securityService = new SecurityHeadersService();

  return async (request: NextRequest) => {
    // Enforce HTTPS in production
    if (process.env.NODE_ENV === 'production') {
      const httpsRedirect = securityService.enforceHTTPS(request);
      if (httpsRedirect) {
        return httpsRedirect;
      }
    }

    // Check for security vulnerabilities
    const vulnerabilities = securityService.checkSecurityVulnerabilities(request);
    if (vulnerabilities.length > 0) {
      console.warn('Security vulnerabilities detected:', vulnerabilities);
      // In production, you might want to block or rate-limit such requests
    }

    // Call the handler
    const response = await handler(request);

    // Apply security headers
    return securityService.applySecurityHeaders(response);
  };
}

// Create singleton instance
export const securityHeadersService = new SecurityHeadersService();