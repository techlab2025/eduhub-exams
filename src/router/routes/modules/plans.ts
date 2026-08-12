import type { RouteRecordRaw } from '@/router/types';
export const planRoutes: RouteRecordRaw[] = [
  {
    path: 'plans',
    name: 'Plans',
    component: () => import('@/views/Plan/IndexPlan.vue'),
    meta: { breadcrumb: 'plans' },
  },
  {
    path: 'plans/add',
    name: 'Add Plan',
    component: () => import('@/views/Plan/AddPlan.vue'),
    meta: { breadcrumb: 'add plan', parent: 'Plans' },
  },
  {
    path: 'plans/edit/:id',
    name: 'Edit Plan',
    component: () => import('@/views/Plan/EditPlan.vue'),
    props: true,
    meta: { breadcrumb: 'edit plan', parent: 'Plans' },
  },
  {
    path: 'plans/:id',
    name: 'Plan Details',
    component: () => import('@/views/Plan/ShowPlan.vue'),
    props: true,
    meta: { breadcrumb: 'plan details', parent: 'Plans' },
  },
];
