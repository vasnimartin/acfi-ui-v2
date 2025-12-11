import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take, tap, switchMap } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Array<string>;

  // Combine the loading state with the role
  // We want to wait until not loading, then check role
  /* 
     New Logic:
     1. SwitchMap to authLoading$.
     2. If loading is true, we act as 'waiting' (can't easily block routing synchronously without a promise or observable completion).
     3. Actually, we take Role and Loading. We assume guard waits for Observable completion or emission.
  */
  
  // Wait for loading to finish, then check role
  return authService.authLoading$.pipe(
    filter(loading => loading === false),
    take(1),
    switchMap(() => authService.currentUserRole$),
    // Instead of just taking the role, we should filter for it to be resolved if we want to be strict,
    // but here we just take the state after loading is done.
    take(1),
    map(role => {
      const user = authService.currentUserValue;
      if (!user) {
        // Not logged in -> Home
        return router.createUrlTree(['/']);
      }
      
      if (requiredRoles && requiredRoles.length > 0) {
          if (role && requiredRoles.includes(role)) {
              return true;
          }
          // Role loaded but not in allowed list -> Home
          // Could redirect to a 'Forbidden' page or Dashboard if they are generic members
          if (!role || role === 'member') {
              return router.createUrlTree(['/dashboard']);
          }
          return router.createUrlTree(['/']);
      }
      
      // No specific roles required, just auth
      return true;
    })
  );
};
