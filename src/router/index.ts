import { createRouter, createWebHistory } from 'vue-router';
import { dashboardRoutes } from './routes/modules';
import { adminRoutes } from './routes/modules/admin';
import { countryRoutes } from './routes/modules/country-standalone';
import { authGuard } from './guards';
import HomeIcon from '@/shared/icons/BreadcrumbIcons/HomeIcon.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/choose-country',
      name: 'Choose Country',
      component: () => import('@/views/auth/LoginCountry.vue'),
    },
    {
      path: '/login',
      name: 'General Login',
      component: () => import('@/views/auth/GeneralLogin.vue'),
    },
    {
      path: '/not-found',
      name: 'Not Found',
      component: () => import('@/views/error/Error.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/views/AppLayout.vue'),
      children: [{ path: '', redirect: { name: 'Admins' } }, ...adminRoutes, ...countryRoutes],
      meta: { icon: HomeIcon },
    },
    {
      path: '/:country_code',
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('@/views/auth/LoginOrg.vue'),
        },
        {
          path: '',
          name: 'Home App',
          component: () => import('@/views/AppLayout.vue'),
          children: [{ path: '', redirect: { name: 'Employees' } }, ...dashboardRoutes],
          meta: { icon: HomeIcon },
        },
      ],
    },
    {
      path: '/',
      redirect: '/choose-country',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/not-found',
    },
  ],
});

router.beforeEach(authGuard);
export default router;
