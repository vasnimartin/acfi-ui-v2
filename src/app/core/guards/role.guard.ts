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
  
  // Clean implementation:
  return authService.authLoading$.pipe(
    filter(loading => loading === false), // Wait until loading is false
    take(1), // Take the first 'false' emission (done loading)
    switchMap(() => authService.currentUserRole$), // Switch to role stream
    take(1), // Take current role
    map(role => {
      const user = authService.currentUserValue;

      if (!user) {
        // Not logged in -> Redirect
        return router.createUrlTree(['/']); 
      }

      // User logged in, check role
      const hasRole = requiredRoles ? requiredRoles.includes(role || '') : true;

      if (hasRole) {
        return true;
      }

      // Logged in but no permission
      // alert('You do not have permission to access.'); 
      return router.createUrlTree(['/']);
    })
  );
};
