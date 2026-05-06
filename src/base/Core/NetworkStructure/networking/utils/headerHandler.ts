import { useUserStore } from '@/stores/user';
import { useCountryStore } from '@/stores/country';
import router from '@/router';

class HeaderHandler {
  private static _instance: HeaderHandler;

  private userStore = useUserStore();
  private countryStore = useCountryStore();

  private constructor() {}

  static get Instance(): HeaderHandler {
    if (!this._instance) {
      this._instance = new HeaderHandler();
    }
    return this._instance;
  }

  getHeader(isAuth = false): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    const userStore = this.userStore;
    const countryStore = this.countryStore;

    const token: string | undefined = '4|wGVp48gP0i6CEUe2jFpiisFwEzKdI1ZpKRqQ5soq6d416862';
    if (userStore?.user !== null) {
      if (isAuth) {
        headers['Authorization'] = 'Bearer ' + token;
      } else {
        headers['Authorization'] = 'Bearer ' + token;
      }
    }

    const savedLocale = localStorage.getItem('lang');
    if (savedLocale) {
      headers['Accept-Language'] = savedLocale;
    }

    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
    headers['Authorization'] = 'Bearer ' + token;

    const currentPath = router.currentRoute.value.path;
    const isStandaloneRoute = currentPath.startsWith('/admin') || currentPath === '/login';

    if (!isStandaloneRoute) {
      const countryCode = countryStore?.getCountryCode();
      if (countryCode) {
        headers['x-country'] = countryCode.toLowerCase();
      } else {
        headers['x-country'] = 'sa';
      }
    }

    return headers;
  }
}

export default HeaderHandler;
