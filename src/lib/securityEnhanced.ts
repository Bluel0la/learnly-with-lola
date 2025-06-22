
import DOMPurify from 'dompurify';

// Enhanced input validation
export const inputValidation = {
  // Sanitize and validate email
  validateEmail: (email: string): { isValid: boolean; sanitized: string } => {
    const sanitized = DOMPurify.sanitize(email.trim().toLowerCase());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(sanitized) && sanitized.length <= 254,
      sanitized
    };
  },

  // Validate password strength
  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Sanitize text input with length limits
  sanitizeText: (text: string, maxLength: number = 1000): string => {
    const sanitized = DOMPurify.sanitize(text.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return sanitized.substring(0, maxLength);
  },

  // Validate file uploads
  validateFile: (file: File, allowedTypes: string[], maxSize: number): { isValid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size exceeds limit' };
    }
    
    return { isValid: true };
  }
};

// Content Security Policy headers
export const getEnhancedSecurityHeaders = (): HeadersInit => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
});

// Rate limiting with different strategies
export class EnhancedRateLimiter {
  private attempts: Map<string, { count: number; windowStart: number; blocked: boolean }> = new Map();
  
  isAllowed(
    key: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000,
    blockDuration: number = 30 * 60 * 1000
  ): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);
    
    // Check if currently blocked
    if (entry?.blocked && (now - entry.windowStart) < blockDuration) {
      return false;
    }
    
    // Reset if window expired or was blocked
    if (!entry || (now - entry.windowStart) >= windowMs || entry.blocked) {
      this.attempts.set(key, { count: 1, windowStart: now, blocked: false });
      return true;
    }
    
    // Increment attempts
    entry.count++;
    
    // Block if exceeded
    if (entry.count > maxAttempts) {
      entry.blocked = true;
      return false;
    }
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  getAttempts(key: string): number {
    return this.attempts.get(key)?.count || 0;
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter();
