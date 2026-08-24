import type { RouteRecordRaw } from '@/router/types';

export const adviceRoutes: RouteRecordRaw[] = [
  {
    path: 'advices',
    name: 'Advices',
    component: () => import('@/views/Advices/IndexAdvice.vue'),
    meta: { breadcrumb: 'advices' },
  },
  {
    path: 'advices/add',
    name: 'Add Advice',
    component: () => import('@/views/Advices/AddAdvice.vue'),
    meta: { breadcrumb: 'add advice', parent: 'Advices' },
  },
  {
    path: 'advices/edit/:id',
    name: 'Edit Advice',
    component: () => import('@/views/Advices/EditAdvice.vue'),
    props: true,
    meta: { breadcrumb: 'edit advice', parent: 'Advices' },
  },
];
