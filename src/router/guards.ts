import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useCountryStore } from '@/stores/country';

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const userData = useUserStore();
  const countryStore = useCountryStore();

  // Public routes
  if (to.path === '/choose-country' || to.path === '/not-found' || to.path === '/login') {
    return next();
  }

  // Standalone admin / country routes
  const isStandaloneRoute = to.path.startsWith('/admin');

  if (isStandaloneRoute) {
    const isLoginPage = to.path === '/login';

    if (!userData.isAuth && !isLoginPage) {
      return next('/login');
    }

    if (isLoginPage && userData.isAuth) {
      return next('/admin/country');
    }

    return next();
  }

  // Country-specific routes
  const country = to.params.country_code as string | undefined;

  if (!country) {
    return next('/choose-country');
  }

  countryStore.setCountryCode(country);

  const countries = ['eg', 'EG', 'sa', 'SA', 'kw', 'KW', 'om', 'OM', 'bh', 'BH', 'qa', 'QA'];

  if (!countries.includes(country)) {
    return next('/choose-country');
  }

  const isLoginPage = to.path.endsWith('/login');

  if (!userData.isAuth && !isLoginPage) {
    return next({
      name: 'Login',
      params: { country_code: country },
    });
  }

  if (isLoginPage && userData.isAuth) {
    return next({ path: `/${country}/` });
  }

  next();
}
