import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface User {
  id?: string | number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  createdAt?: string; // ISO date string for subscription/trial logic
  subscription_status?: string;
  subscription_plan?: string | null;
  trial_ends_at?: string | null;
  subscription_expires_at?: string | null;
  requires_subscription?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
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
        await this.http.post(
          `${this.API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        ).toPromise().catch(() => {
          // Ignore logout API errors - we'll clear local state anyway
        });
      }
    } catch (e) {
      console.error('Logout API call failed:', e);
    } finally {
      // Always clear local storage/session storage first
      this.clearAuthData();
      
      // Use setTimeout to ensure data is cleared before navigation
      // This prevents race conditions with guards checking auth state
      setTimeout(() => {
        // Use replaceUrl to prevent back navigation to dashboard after logout
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }, 0);
    }
  }

  /**
   * Clear all authentication data from storage
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('signup_date'); // Clear signup date to prevent guard conflicts
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
  }

  /**
   * Store authentication data
   */
  storeAuthData(token: string, user: User, rememberMe: boolean = false): void {
    // Ensure we have a createdAt date to base the 14-day trial on.
    // Prefer an existing createdAt if provided by the backend or previously stored.
    const existingUser = this.getCurrentUser();
    const existingCreatedAt =
      (user && user.createdAt) ||
      (existingUser && existingUser.createdAt) ||
      localStorage.getItem('signup_date');

    const createdAtToStore = existingCreatedAt || new Date().toISOString();

    // Persist signup date separately for guards
    localStorage.setItem('signup_date', createdAtToStore);

    user = {
      ...user,
      createdAt: createdAtToStore,
    };

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
    return this.http.post<{ message: string }>(
      `${this.API_BASE_URL}/auth/forgot-password`,
      { email }
    ).toPromise();
  }

  /**
   * Submit a new password using the reset token.
   */
  resetPassword(token: string, password: string) {
    return this.http.post<{ message: string }>(
      `${this.API_BASE_URL}/auth/reset-password`,
      { token, password }
    ).toPromise();
  }
}

