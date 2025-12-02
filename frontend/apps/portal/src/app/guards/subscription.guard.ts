import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Subscription guard:
 * - Ensures user is authenticated
 * - If trial period (14 days from signup) is over, redirects to /subscription
 */
export const subscriptionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First, ensure the user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // Allow access to the subscription page itself without redirect loop
  if (state.url.startsWith('/subscription')) {
    return true;
  }

  const signupDateStr = localStorage.getItem('signup_date');
  if (!signupDateStr) {
    // If we don't know signup date, treat as still within trial
    return true;
  }

  const signupDate = new Date(signupDateStr);
  if (isNaN(signupDate.getTime())) {
    return true;
  }

  const now = new Date();
  const diffMs = now.getTime() - signupDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays > 14) {
    // Trial expired: redirect to subscription page
    router.navigate(['/subscription'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};


