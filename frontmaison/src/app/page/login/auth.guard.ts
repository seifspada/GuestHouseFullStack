import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../Model/user.model';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.getCurrentUser();

  if (!user) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRoles = route.data['roles'] as UserRole[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (user.role && requiredRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};