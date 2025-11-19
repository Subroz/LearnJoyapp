import { ApiResponse } from '@/types';

// API configuration
const API_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Generic API error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Retry mechanism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        console.warn(`Request failed, retrying in ${delayMs}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await delay(delayMs * Math.pow(2, attempt)); // Exponential backoff
      }
    }
  }

  throw lastError!;
};

// API wrapper with error handling and retries
export const apiWrapper = {
  // GET request
  get: async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    return retryRequest(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const response = await fetch(url, {
          method: 'GET',
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response.status.toString()
          );
        }

        const data = await response.json();
        return {
          data,
          success: true,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408, 'TIMEOUT');
          }
          throw new ApiError(error.message, undefined, 'NETWORK_ERROR');
        }

        throw new ApiError('Unknown error occurred', undefined, 'UNKNOWN_ERROR');
      }
    });
  },

  // POST request
  post: async <T>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> => {
    return retryRequest(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const response = await fetch(url, {
          method: 'POST',
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          body: data ? JSON.stringify(data) : undefined,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response.status.toString()
          );
        }

        const responseData = await response.json();
        return {
          data: responseData,
          success: true,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408, 'TIMEOUT');
          }
          throw new ApiError(error.message, undefined, 'NETWORK_ERROR');
        }

        throw new ApiError('Unknown error occurred', undefined, 'UNKNOWN_ERROR');
      }
    });
  },

  // PUT request
  put: async <T>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> => {
    return retryRequest(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const response = await fetch(url, {
          method: 'PUT',
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          body: data ? JSON.stringify(data) : undefined,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response.status.toString()
          );
        }

        const responseData = await response.json();
        return {
          data: responseData,
          success: true,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408, 'TIMEOUT');
          }
          throw new ApiError(error.message, undefined, 'NETWORK_ERROR');
        }

        throw new ApiError('Unknown error occurred', undefined, 'UNKNOWN_ERROR');
      }
    });
  },

  // DELETE request
  delete: async <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    return retryRequest(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      try {
        const response = await fetch(url, {
          method: 'DELETE',
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response.status.toString()
          );
        }

        const data = await response.json();
        return {
          data,
          success: true,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408, 'TIMEOUT');
          }
          throw new ApiError(error.message, undefined, 'NETWORK_ERROR');
        }

        throw new ApiError('Unknown error occurred', undefined, 'UNKNOWN_ERROR');
      }
    });
  },
};

// Utility functions
export const apiUtils = {
  // Build query string from parameters
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  },

  // Handle API errors with user-friendly messages
  handleError: (error: unknown): string => {
    if (error instanceof ApiError) {
      switch (error.code) {
        case 'TIMEOUT':
          return 'Request timed out. Please check your connection and try again.';
        case 'NETWORK_ERROR':
          return 'Network error. Please check your internet connection.';
        case '401':
          return 'Authentication required. Please sign in again.';
        case '403':
          return 'Access denied. You do not have permission to perform this action.';
        case '404':
          return 'The requested resource was not found.';
        case '500':
          return 'Server error. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unknown error occurred. Please try again.';
  },

  // Check if device is online
  isOnline: (): boolean => {
    // This would typically use a network state library
    // For now, we'll assume the device is online
    return true;
  },

  // Validate API response
  validateResponse: <T>(response: ApiResponse<T>): boolean => {
    return response.success && response.data !== undefined;
  },
};

export default apiWrapper;
