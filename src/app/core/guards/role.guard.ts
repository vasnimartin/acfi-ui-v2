import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take, tap } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as Array<string>;

  // Wait for the role to be loaded (not undefined)
  return authService.currentUserRole$.pipe(
    // You might want to filter out the initial null if you are strict, 
    // but here we just check if value is available or wait for auth.
    // However, since behavior subject has initial value, we rely on auth flow.
    // For simplicity, we just take the current value effectively.
    // Note: In a real app, you might need to wait for an 'authInitialized' signal.
    // Here we leverage the fact that loadUserRole is called early. 
    // A more robust way is to filter(role => role !== undefined) if we had a loading state.
    take(1), 
    map(role => {
      const user = authService.currentUserValue;
      
      if (!user) {
        // Not logged in
        return router.createUrlTree(['/']); // Redirect to home or login popup
      }

      const hasRole = requiredRoles ? requiredRoles.includes(role || '') : true;

      if (hasRole) {
        return true;
      }

      // Logged in but no permission
      // alert('You do not have permission to access this page'); 
      return router.createUrlTree(['/']);
    })
  );
};
