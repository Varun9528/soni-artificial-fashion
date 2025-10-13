// Error handling utility for the application

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorMessages: Record<string, string> = {
  // Authentication errors
  'AUTH_INVALID_CREDENTIALS': 'Invalid email or password',
  'AUTH_USER_NOT_FOUND': 'User not found',
  'AUTH_EMAIL_EXISTS': 'User with this email already exists',
  'AUTH_UNAUTHORIZED': 'You are not authorized to perform this action',
  'AUTH_FORBIDDEN': 'Access forbidden',
  'AUTH_TOKEN_EXPIRED': 'Your session has expired. Please login again',
  'AUTH_TOKEN_INVALID': 'Invalid authentication token',
  
  // Validation errors
  'VALIDATION_REQUIRED': 'This field is required',
  'VALIDATION_EMAIL': 'Please enter a valid email address',
  'VALIDATION_PHONE': 'Please enter a valid phone number',
  'VALIDATION_PASSWORD': 'Password must be at least 8 characters long',
  'VALIDATION_PINCODE': 'Please enter a valid 6-digit pincode',
  
  // Database errors
  'DB_CONNECTION_FAILED': 'Unable to connect to database',
  'DB_RECORD_NOT_FOUND': 'Record not found',
  'DB_RECORD_EXISTS': 'Record already exists',
  
  // Network errors
  'NETWORK_ERROR': 'Network error. Please check your connection',
  'NETWORK_TIMEOUT': 'Request timeout. Please try again',
  
  // Payment errors
  'PAYMENT_FAILED': 'Payment failed. Please try again',
  'PAYMENT_CANCELLED': 'Payment cancelled',
  
  // Cart errors
  'CART_ITEM_NOT_FOUND': 'Item not found in cart',
  'CART_OUT_OF_STOCK': 'Item is out of stock',
  
  // General errors
  'INTERNAL_SERVER_ERROR': 'Something went wrong. Please try again later',
  'BAD_REQUEST': 'Invalid request',
  'NOT_FOUND': 'Resource not found',
  'UNKNOWN_ERROR': 'An unexpected error occurred'
};

export const handleApiError = (error: any): { message: string; code?: string; statusCode?: number } => {
  // Handle AppError instances
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    };
  }
  
  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      message: errorMessages.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
      statusCode: 0
    };
  }
  
  // Handle API response errors
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle specific status codes
    switch (status) {
      case 400:
        return {
          message: data?.error || errorMessages.BAD_REQUEST,
          code: 'BAD_REQUEST',
          statusCode: status
        };
      case 401:
        return {
          message: errorMessages.AUTH_UNAUTHORIZED,
          code: 'AUTH_UNAUTHORIZED',
          statusCode: status
        };
      case 403:
        return {
          message: errorMessages.AUTH_FORBIDDEN,
          code: 'AUTH_FORBIDDEN',
          statusCode: status
        };
      case 404:
        return {
          message: errorMessages.NOT_FOUND,
          code: 'NOT_FOUND',
          statusCode: status
        };
      case 409:
        return {
          message: data?.error || errorMessages.DB_RECORD_EXISTS,
          code: 'DB_RECORD_EXISTS',
          statusCode: status
        };
      case 500:
        return {
          message: errorMessages.INTERNAL_SERVER_ERROR,
          code: 'INTERNAL_SERVER_ERROR',
          statusCode: status
        };
      default:
        return {
          message: data?.error || errorMessages.UNKNOWN_ERROR,
          code: 'UNKNOWN_ERROR',
          statusCode: status
        };
    }
  }
  
  // Handle other errors
  return {
    message: error.message || errorMessages.UNKNOWN_ERROR,
    code: 'UNKNOWN_ERROR',
    statusCode: 500
  };
};

export const showErrorNotification = (error: any, title?: string) => {
  const { message } = handleApiError(error);
  
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification(message, 'error', title, 5000);
  } else {
    console.error('Error:', message);
  }
};

export const showSuccessNotification = (message: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification(message, 'success', title, 3000);
  } else {
    console.log('Success:', message);
  }
};

export const showInfoNotification = (message: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification(message, 'info', title, 4000);
  } else {
    console.log('Info:', message);
  }
};

export const showWarningNotification = (message: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).showNotification) {
    (window as any).showNotification(message, 'warning', title, 4000);
  } else {
    console.warn('Warning:', message);
  }
};