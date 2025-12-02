import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);
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
   * Call logout API endpoint
   * Returns the logout API response with success status
   */
  async callLogoutAPI(): Promise<{ message: string; success: boolean }> {
    const token = this.getToken();
    let logoutResponse: { message: string; success: boolean } = {
      message: 'Logged out successfully',
      success: true
    };
    
    // Try to call backend logout endpoint
    if (token) {
      try {
        const response = await firstValueFrom(
          this.http.post<{ message: string; success: boolean }>(
            `${this.API_BASE_URL}/auth/logout`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
        );
        logoutResponse = response;
      } catch (error) {
        // Log error but continue with logout process
        // Logout should work even if backend call fails
        console.warn('Logout API call failed, continuing with local logout:', error);
        logoutResponse = {
          message: 'Logout completed (API call failed)',
          success: false
        };
      }
    }
    
    return logoutResponse;
  }

  /**
   * Logout user - clear tokens and redirect to login
   */
  async logout(): Promise<void> {
    // Clear local storage/session storage FIRST
    this.clearAuthData();
    
    // Redirect to login page with replaceUrl to replace current route in history
    // This ensures the dashboard/previous page is completely removed
    await this.router.navigate(['/login'], {
      replaceUrl: true,
      skipLocationChange: false
    });
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

