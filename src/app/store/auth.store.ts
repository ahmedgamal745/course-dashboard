import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { User, Role } from '../core/models/user.model';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const STORAGE_KEY = 'auth_session';

function getInitialState(): AuthState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return { user: JSON.parse(saved), isAuthenticated: true };
  }
  return { user: null, isAuthenticated: false };
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(getInitialState()),
  withMethods((store, router = inject(Router)) => ({
    login(user: User) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      patchState(store, { user, isAuthenticated: true });
      router.navigate(['/courses']);
    },
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      patchState(store, { user: null, isAuthenticated: false });
      router.navigate(['/login']);
    },
    hasRole(roles: Role[]): boolean {
      const user = store.user();
      if (!user) return false;
      return roles.includes(user.role) || user.role === 'master';
    }
  }))
);
