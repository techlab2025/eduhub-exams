import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '@/stores/user';

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const userData = useUserStore();

  // 1. Allow public pages
  if (to.path === '/choose-country' || to.path === '/not-found') {
    return next();
  }

  // 2. Must have country code
  const country = to.params.country_code as string | undefined;

  if (!country) {
    return next('/choose-country');
  }

  // 3. Check if already on login page (use path, not name!)
  const isLoginPage = to.path.endsWith('/login');

  // 4. Not authenticated → go to login (but don't loop)
  if (!userData.isAuth && !isLoginPage) {
    return next({
      name: 'Login',
      params: { country_code: country },
    });
  }

  // 5. Authenticated → can't access login
  if (isLoginPage && userData.isAuth) {
    const redirectPath =
      userData.user?.type === 1 ? `/${country}/organization` : `/${country}/admin`;
    return next({ path: redirectPath });
  }

  // 6. Allow
  next();
}
