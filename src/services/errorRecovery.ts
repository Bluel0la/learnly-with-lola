
import { toast } from '@/hooks/use-toast';
import { secureTokenStorage } from './secureTokenStorage';

export interface ErrorRecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallbackMessage?: string;
  showToast?: boolean;
}

export class ErrorRecoveryService {
  private static retryCount = new Map<string, number>();

  static async withRetry<T>(
    operation: () => Promise<T>,
    key: string,
    options: ErrorRecoveryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      fallbackMessage = 'Operation failed after multiple attempts',
      showToast = true
    } = options;

    const currentRetries = this.retryCount.get(key) || 0;

    try {
      const result = await operation();
      // Reset retry count on success
      this.retryCount.delete(key);
      return result;
    } catch (error) {
      console.error(`Operation ${key} failed (attempt ${currentRetries + 1}):`, error);

      if (currentRetries < maxRetries) {
        this.retryCount.set(key, currentRetries + 1);
        
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, currentRetries);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.withRetry(operation, key, options);
      }

      // Handle specific error types
      if (error instanceof Error && error.message.includes('401')) {
        secureTokenStorage.removeToken();
        if (showToast) {
          toast({
            title: "Session expired",
            description: "Please log in again",
            variant: "destructive"
          });
        }
        window.location.href = '/login';
        throw error;
      }

      if (showToast) {
        toast({
          title: "Error",
          description: fallbackMessage,
          variant: "destructive"
        });
      }

      throw error;
    }
  }

  static handleNetworkError(error: Error): void {
    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
      toast({
        title: "Connection Issue",
        description: "Please check your internet connection and try again",
        variant: "destructive"
      });
    }
  }

  static isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'NetworkError',
      'timeout',
      'ECONNRESET',
      'ETIMEDOUT',
      '502',
      '503',
      '504'
    ];
    
    return retryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  }
}
