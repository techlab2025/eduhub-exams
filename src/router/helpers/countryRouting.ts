import type { RouteLocationRaw, RouteLocationPathRaw, RouteLocationNamedRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';
import { useCountryStore } from '@/stores/country';

/**
 * Composable to work with country-prefixed routing
 */
export function useCountryRouting() {
  const route = useRoute();
  const router = useRouter();
  const countryStore = useCountryStore();

  const countryCode = () => (route.params.country_code as string) || countryStore.getCountryCode();

  /**
   * Build a path string with the current country code prefix.
   * @example createCountryPath('/organization') → '/eg/organization'
   */
  function createCountryPath(path: string): string {
    const code = countryCode();
    if (!code) return path;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `/${code}${normalized}`;
  }

  /**
   * Build a route location object with country_code injected.
   * Works with named routes and path strings.
   */
  function createCountryRoute(to: RouteLocationRaw): RouteLocationRaw {
    const code = countryCode();

    if (typeof to === 'string') {
      if (to.startsWith('http') || to.startsWith('//')) return to;
      return createCountryPath(to);
    }

    if ('path' in to && to.path) {
      const pathRoute = to as RouteLocationPathRaw;
      if (pathRoute.path.startsWith('http') || pathRoute.path.startsWith('//')) {
        return to;
      }
      return { ...pathRoute, path: createCountryPath(pathRoute.path) };
    }

    const namedRoute = to as RouteLocationNamedRaw;
    return {
      ...namedRoute,
      params: {
        ...(namedRoute.params || {}),
        country_code: code,
      },
    };
  }

  /**
   * Programmatically navigate while injecting the current country code.
   */
  function pushWithCountry(to: RouteLocationRaw) {
    return router.push(createCountryRoute(to));
  }

  /**
   * Replace current route while injecting the current country code.
   */
  function replaceWithCountry(to: RouteLocationRaw) {
    return router.replace(createCountryRoute(to));
  }

  return {
    countryCode,
    createCountryPath,
    createCountryRoute,
    pushWithCountry,
    replaceWithCountry,
  };
}
