
import { API_BASE_URL, getAuthHeaders, getBasicHeaders } from './apiConfig';
import { secureTokenStorage } from './secureTokenStorage';
import { rateLimiter } from '@/lib/security';

// Types for API requests and responses
export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  first_name: string;
  last_name: string;
  gender?: string;
  age?: number;
  email: string;
  educational_level?: string;
}

export interface ProfileUpdateRequest {
  firstname?: string;
  lastname?: string;
  educational_level?: string;
  age?: number;
}

// Authentication API service
export const authApi = {
  // Register a new user
  signup: async (userData: SignupRequest): Promise<any> => {
    // Rate limiting check
    if (!rateLimiter.isAllowed('signup', 3, 15 * 60 * 1000)) {
      throw new Error('Too many signup attempts. Please try again later.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getBasicHeaders(),
        body: JSON.stringify(userData),
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Registration failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        throw new Error('Network connection issue. Please check your internet connection and try again.');
      }
      throw error;
    }
  },
  
  // Login a user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Rate limiting check
    if (!rateLimiter.isAllowed(`login_${credentials.email}`, 5, 15 * 60 * 1000)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getBasicHeaders(),
        body: JSON.stringify(credentials),
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Login failed');
      }
      
      const result = await response.json();
      
      // Set token with expiration when login is successful
      secureTokenStorage.setToken(result.access_token);
      
      // Reset rate limiting on successful login
      rateLimiter.reset(`login_${credentials.email}`);
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        throw new Error('Network connection issue. Please check your internet connection and try again.');
      }
      throw error;
    }
  },

  // Logout a user
  logout: async (): Promise<void> => {
    try {
      const token = secureTokenStorage.getToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Logout error:', errorData);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove token from storage, even if request fails
      secureTokenStorage.removeToken();
    }
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch profile');
      }

      return response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData: ProfileUpdateRequest): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Profile update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Account deletion failed');
      }
      
      // Remove token after successful deletion
      secureTokenStorage.removeToken();
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    }
  }
};
