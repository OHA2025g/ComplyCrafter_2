import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guest Guard - Prevents authenticated users from accessing login/signup pages
 * If user is already logged in, redirect them to dashboard
 * Usage: Add to login/signup routes: canActivate: [guestGuard]
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // User is already logged in, redirect to dashboard
    router.navigate(['/dashboard']);
    return false;
  } else {
    // User is not logged in, allow access to login/signup
    return true;
  }
};

