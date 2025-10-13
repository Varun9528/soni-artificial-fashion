// Validation utilities for the application

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationService {
  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number (Indian format)
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  // Validate pincode (Indian format)
  static validatePincode(pincode: string): boolean {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
  }

  // Validate password strength
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one digit');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate required fields
  static validateRequired(value: any, fieldName: string): ValidationError | null {
    if (value === null || value === undefined || value === '') {
      return { field: fieldName, message: `${fieldName} is required` };
    }
    return null;
  }

  // Validate string length
  static validateStringLength(
    value: string, 
    fieldName: string, 
    minLength?: number, 
    maxLength?: number
  ): ValidationError | null {
    if (minLength && value.length < minLength) {
      return { field: fieldName, message: `${fieldName} must be at least ${minLength} characters long` };
    }
    
    if (maxLength && value.length > maxLength) {
      return { field: fieldName, message: `${fieldName} must be no more than ${maxLength} characters long` };
    }
    
    return null;
  }

  // Validate number range
  static validateNumberRange(
    value: number, 
    fieldName: string, 
    min?: number, 
    max?: number
  ): ValidationError | null {
    if (min !== undefined && value < min) {
      return { field: fieldName, message: `${fieldName} must be at least ${min}` };
    }
    
    if (max !== undefined && value > max) {
      return { field: fieldName, message: `${fieldName} must be no more than ${max}` };
    }
    
    return null;
  }

  // Validate array
  static validateArray(
    value: any[], 
    fieldName: string, 
    minLength?: number, 
    maxLength?: number
  ): ValidationError | null {
    if (!Array.isArray(value)) {
      return { field: fieldName, message: `${fieldName} must be an array` };
    }
    
    if (minLength && value.length < minLength) {
      return { field: fieldName, message: `${fieldName} must contain at least ${minLength} items` };
    }
    
    if (maxLength && value.length > maxLength) {
      return { field: fieldName, message: `${fieldName} must contain no more than ${maxLength} items` };
    }
    
    return null;
  }

  // Validate object
  static validateObject(value: any, fieldName: string): ValidationError | null {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { field: fieldName, message: `${fieldName} must be an object` };
    }
    return null;
  }

  // Validate URL
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Validate date
  static validateDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }
    
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }

  // Validate enum value
  static validateEnum<T>(value: T, validValues: T[], fieldName: string): ValidationError | null {
    if (!validValues.includes(value)) {
      return { field: fieldName, message: `${fieldName} must be one of: ${validValues.join(', ')}` };
    }
    return null;
  }
}

// Validation helper for forms
export class FormValidator {
  private errors: ValidationError[] = [];

  // Add validation rules
  addRequired(field: string, value: any, fieldName?: string): this {
    const error = ValidationService.validateRequired(value, fieldName || field);
    if (error) this.errors.push(error);
    return this;
  }

  addEmail(field: string, email: string, fieldName?: string): this {
    if (email && !ValidationService.validateEmail(email)) {
      this.errors.push({ 
        field, 
        message: `${fieldName || field} must be a valid email address` 
      });
    }
    return this;
  }

  addPhone(field: string, phone: string, fieldName?: string): this {
    if (phone && !ValidationService.validatePhone(phone)) {
      this.errors.push({ 
        field, 
        message: `${fieldName || field} must be a valid 10-digit Indian phone number` 
      });
    }
    return this;
  }

  addPincode(field: string, pincode: string, fieldName?: string): this {
    if (pincode && !ValidationService.validatePincode(pincode)) {
      this.errors.push({ 
        field, 
        message: `${fieldName || field} must be a valid 6-digit pincode` 
      });
    }
    return this;
  }

  addPassword(field: string, password: string, fieldName?: string): this {
    if (password) {
      const result = ValidationService.validatePassword(password);
      if (!result.valid) {
        this.errors.push({ 
          field, 
          message: `${fieldName || field}: ${result.errors.join(', ')}` 
        });
      }
    }
    return this;
  }

  addStringLength(
    field: string, 
    value: string, 
    minLength?: number, 
    maxLength?: number, 
    fieldName?: string
  ): this {
    const error = ValidationService.validateStringLength(value, fieldName || field, minLength, maxLength);
    if (error) this.errors.push(error);
    return this;
  }

  addNumberRange(
    field: string, 
    value: number, 
    min?: number, 
    max?: number, 
    fieldName?: string
  ): this {
    const error = ValidationService.validateNumberRange(value, fieldName || field, min, max);
    if (error) this.errors.push(error);
    return this;
  }

  addArray(
    field: string, 
    value: any[], 
    minLength?: number, 
    maxLength?: number, 
    fieldName?: string
  ): this {
    const error = ValidationService.validateArray(value, fieldName || field, minLength, maxLength);
    if (error) this.errors.push(error);
    return this;
  }

  addObject(field: string, value: any, fieldName?: string): this {
    const error = ValidationService.validateObject(value, fieldName || field);
    if (error) this.errors.push(error);
    return this;
  }

  addUrl(field: string, url: string, fieldName?: string): this {
    if (url && !ValidationService.validateUrl(url)) {
      this.errors.push({ 
        field, 
        message: `${fieldName || field} must be a valid URL` 
      });
    }
    return this;
  }

  addDate(field: string, date: string, fieldName?: string): this {
    if (date && !ValidationService.validateDate(date)) {
      this.errors.push({ 
        field, 
        message: `${fieldName || field} must be a valid date (YYYY-MM-DD)` 
      });
    }
    return this;
  }

  addEnum<T>(field: string, value: T, validValues: T[], fieldName?: string): this {
    const error = ValidationService.validateEnum(value, validValues, fieldName || field);
    if (error) this.errors.push(error);
    return this;
  }

  // Get validation errors
  getErrors(): ValidationError[] {
    return [...this.errors];
  }

  // Check if form is valid
  isValid(): boolean {
    return this.errors.length === 0;
  }

  // Get error for specific field
  getFieldError(field: string): string | null {
    const error = this.errors.find(e => e.field === field);
    return error ? error.message : null;
  }

  // Clear errors
  clear(): void {
    this.errors = [];
  }
}