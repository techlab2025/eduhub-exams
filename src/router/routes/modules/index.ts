import type { RouteRecordRaw } from 'vue-router';
import { emailRoutes } from './email';
import { InputsRoutes } from './inputs';



export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/AppHome.vue'),
  },
  ...emailRoutes,
  ...InputsRoutes
  

]