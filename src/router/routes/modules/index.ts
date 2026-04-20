import type { RouteRecordRaw } from "vue-router";
import { emailRoutes } from "./email";


export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/AppLayout.vue'),
    children: [
      ...emailRoutes,
    ]
  },
]
