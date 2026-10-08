import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/api.models';
import { AuthService } from '../services/auth.service';

export function roleGuard(roles: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated() && auth.role() && roles.includes(auth.role()!)) {
      return true;
    }
    return router.createUrlTree(['/']);
  };
}
