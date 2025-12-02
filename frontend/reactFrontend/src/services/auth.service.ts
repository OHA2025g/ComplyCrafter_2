import axios from 'axios';
import { environment } from '../config/environment';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

class AuthService {
  private readonly API_BASE_URL = environment.apiUrl;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Get authentication token from storage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Get current user information
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (user) {
      if (user.first_name && user.last_name) {
        return `${user.first_name} ${user.last_name}`;
      } else if (user.first_name) {
        return user.first_name;
      } else if (user.username) {
        return user.username;
      } else if (user.email) {
        return user.email;
      }
    }
    return 'User';
  }

  /**
   * Logout user - clear tokens and redirect to login
   */
  async logout(): Promise<void> {
    try {
      // Optionally call backend logout endpoint
      const token = this.getToken();
      if (token) {
        await axios.post(
          `${this.API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        ).catch(() => {
          // Ignore logout API errors - we'll clear local state anyway
        });
      }
    } catch (e) {
      console.error('Logout API call failed:', e);
    } finally {
      // Always clear local storage/session storage
      this.clearAuthData();
    }
  }

  /**
   * Clear all authentication data from storage
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
  }

  /**
   * Store authentication data
   */
  storeAuthData(token: string, user: User, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Initiate forgot password flow.
   */
  requestPasswordReset(email: string) {
    return axios.post<{ message: string }>(
      `${this.API_BASE_URL}/auth/forgot-password`,
      { email }
    );
  }

  /**
   * Submit a new password using the reset token.
   */
  resetPassword(token: string, password: string) {
    return axios.post<{ message: string }>(
      `${this.API_BASE_URL}/auth/reset-password`,
      { token, password }
    );
  }
}

export const authService = new AuthService();



