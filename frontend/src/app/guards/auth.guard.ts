import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects to /login if user is not logged in
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/login']);
  return false;
};
