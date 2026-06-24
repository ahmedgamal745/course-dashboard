import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { Role } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as Role[];

  if (!authStore.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (authStore.hasRole(allowedRoles)) {
    return true;
  }

  // If authenticated but no permission, redirect to dashboard
  router.navigate(['/courses']);
  return false;
};
