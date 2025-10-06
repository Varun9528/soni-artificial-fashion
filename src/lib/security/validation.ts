// Input validation and sanitization utilities

// Data validation schemas using Zod-like structure
export interface ValidationRule {
  type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'uuid' | 'array' | 'object';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  sanitize?: boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  success: boolean;
  data?: any;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export class InputValidator {
  // Validate input against schema
  validate(input: any, schema: ValidationSchema): ValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const sanitizedData: any = {};

    for (const [field, rule] of Object.entries(schema)) {
      const value = input[field];

      // Check required fields
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }

      // Skip validation for optional undefined fields
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      const typeValidation = this.validateType(value, rule.type);
      if (!typeValidation.valid) {
        errors.push({ field, message: typeValidation.message });
        continue;
      }

      // Length/size validation
      if (rule.min !== undefined || rule.max !== undefined) {
        const sizeValidation = this.validateSize(value, rule.min, rule.max, rule.type);
        if (!sizeValidation.valid) {
          errors.push({ field, message: sizeValidation.message });
          continue;
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          errors.push({ field, message: `${field} format is invalid` });
          continue;
        }
      }

      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          const message = typeof customResult === 'string' ? customResult : `${field} is invalid`;
          errors.push({ field, message });
          continue;
        }
      }

      // Sanitize if requested
      const finalValue = rule.sanitize ? this.sanitizeValue(value, rule.type) : value;
      sanitizedData[field] = finalValue;
    }

    return {
      success: errors.length === 0,
      data: errors.length === 0 ? sanitizedData : undefined,
      errors,
    };
  }

  // Validate type
  private validateType(value: any, type: ValidationRule['type']): { valid: boolean; message: string } {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return { valid: false, message: 'Must be a string' };
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return { valid: false, message: 'Must be a valid number' };
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean') {
          return { valid: false, message: 'Must be a boolean' };
        }
        break;
      case 'email':
        if (typeof value !== 'string' || !this.isValidEmail(value)) {
          return { valid: false, message: 'Must be a valid email address' };
        }
        break;
      case 'url':
        if (typeof value !== 'string' || !this.isValidURL(value)) {
          return { valid: false, message: 'Must be a valid URL' };
        }
        break;
      case 'uuid':
        if (typeof value !== 'string' || !this.isValidUUID(value)) {
          return { valid: false, message: 'Must be a valid UUID' };
        }
        break;
      case 'array':
        if (!Array.isArray(value)) {
          return { valid: false, message: 'Must be an array' };
        }
        break;
      case 'object':
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          return { valid: false, message: 'Must be an object' };
        }
        break;
    }
    return { valid: true, message: '' };
  }

  // Validate size/length
  private validateSize(
    value: any,
    min?: number,
    max?: number,
    type?: ValidationRule['type']
  ): { valid: boolean; message: string } {
    let size: number;

    switch (type) {
      case 'string':
        size = (value as string).length;
        break;
      case 'array':
        size = (value as any[]).length;
        break;
      case 'number':
        size = value as number;
        break;
      default:
        return { valid: true, message: '' };
    }

    if (min !== undefined && size < min) {
      return { valid: false, message: `Must be at least ${min}` };
    }

    if (max !== undefined && size > max) {
      return { valid: false, message: `Must be at most ${max}` };
    }

    return { valid: true, message: '' };
  }

  // Sanitize value
  private sanitizeValue(value: any, type: ValidationRule['type']): any {
    switch (type) {
      case 'string':
        return this.sanitizeString(value);
      case 'email':
        return this.sanitizeEmail(value);
      default:
        return value;
    }
  }

  // Sanitize string (prevent XSS)
  private sanitizeString(value: string): string {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  }

  // Sanitize email
  private sanitizeEmail(value: string): string {
    return value.toLowerCase().trim();
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // URL validation
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // UUID validation
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // SQL injection prevention
  preventSQLInjection(value: string): string {
    const sqlKeywords = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
      'EXEC', 'EXECUTE', 'UNION', 'SCRIPT', 'DECLARE', 'CAST', 'CONVERT'
    ];
    
    let sanitized = value;
    sqlKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    
    // Remove dangerous characters
    sanitized = sanitized.replace(/[';\-\-]/g, '');
    
    return sanitized;
  }

  // Path traversal prevention
  preventPathTraversal(path: string): string {
    return path.replace(/\.\.\/|\.\.\\|\.\.\//g, '');
  }

  // Remove null bytes
  removeNullBytes(value: string): string {
    return value.replace(/\0/g, '');
  }

  // Comprehensive input sanitization
  sanitizeInput(value: any): any {
    if (typeof value === 'string') {
      let sanitized = value;
      sanitized = this.removeNullBytes(sanitized);
      sanitized = this.preventSQLInjection(sanitized);
      sanitized = this.preventPathTraversal(sanitized);
      sanitized = this.sanitizeString(sanitized);
      return sanitized;
    }
    
    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeInput(item));
    }
    
    if (value && typeof value === 'object') {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.sanitizeInput(val);
      }
      return sanitized;
    }
    
    return value;
  }
}

// Common validation schemas
export const commonSchemas = {
  email: {
    email: { type: 'email' as const, required: true, sanitize: true },
  },
  
  password: {
    password: { 
      type: 'string' as const, 
      required: true, 
      min: 10,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    },
  },
  
  userRegistration: {
    name: { type: 'string' as const, required: true, min: 2, max: 100, sanitize: true },
    email: { type: 'email' as const, required: true, sanitize: true },
    password: { 
      type: 'string' as const, 
      required: true, 
      min: 10,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    },
    phone: { type: 'string' as const, required: false, pattern: /^\+?[\d\s-()]+$/, sanitize: true },
  },
  
  userLogin: {
    email: { type: 'email' as const, required: true, sanitize: true },
    password: { type: 'string' as const, required: true },
  },
  
  productCreate: {
    name: { type: 'string' as const, required: true, min: 1, max: 200, sanitize: true },
    description: { type: 'string' as const, required: true, max: 2000, sanitize: true },
    price: { type: 'number' as const, required: true, min: 0 },
    stock: { type: 'number' as const, required: true, min: 0 },
    categoryId: { type: 'uuid' as const, required: true },
  },
  
  orderCreate: {
    items: { type: 'array' as const, required: true, min: 1 },
    shippingAddress: { type: 'object' as const, required: true },
    paymentMethod: { type: 'string' as const, required: true, sanitize: true },
  },
};

// File upload validation
export interface FileValidationOptions {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions: string[];
  virusScan?: boolean;
}

export class FileValidator {
  validateFile(
    file: File,
    options: FileValidationOptions
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size
    if (file.size > options.maxSize) {
      errors.push(`File size exceeds maximum allowed size of ${options.maxSize} bytes`);
    }

    // Check file type
    if (!options.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      errors.push(`File extension ${extension} is not allowed`);
    }

    // Check for potential malicious files
    if (this.isSuspiciousFile(file)) {
      errors.push('File appears to be suspicious or potentially malicious');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private isSuspiciousFile(file: File): boolean {
    const suspiciousExtensions = ['exe', 'bat', 'cmd', 'scr', 'pif', 'com', 'vbs', 'js'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    return suspiciousExtensions.includes(extension || '');
  }
}

// Singleton instances
export const inputValidator = new InputValidator();
export const fileValidator = new FileValidator();