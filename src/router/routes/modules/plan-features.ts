import type { RouteRecordRaw } from '@/router/types';
export const planFeatureRoutes: RouteRecordRaw[] = [
  {
    path: 'plan-features',
    name: 'Plan Features',
    component: () => import('@/views/PlanFeatures/IndexPlanFeatures.vue'),
    meta: { breadcrumb: 'plan_features' },
  },
  {
    path: 'plan-features/add',
    name: 'Add Plan Feature',
    component: () => import('@/views/PlanFeatures/AddPlanFeature.vue'),
    meta: { breadcrumb: 'add_plan_feature', parent: 'Plan Features' },
  },
  {
    path: 'plan-features/edit/:id',
    name: 'Edit Plan Feature',
    component: () => import('@/views/PlanFeatures/EditPlanFeature.vue'),
    props: true,
    meta: { breadcrumb: 'edit_plan_feature', parent: 'Plan Features' },
  },
];
