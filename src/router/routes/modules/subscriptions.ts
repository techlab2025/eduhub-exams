import type { RouteRecordRaw } from '@/router/types';
export const subscriptionRoutes: RouteRecordRaw[] = [
  {
    path: 'subscriptions',
    name: 'Subscriptions',
    component: () => import('@/views/Subscriptions/IndexSubscriptions.vue'),
    meta: { breadcrumb: 'subscriptions' },
  },
  {
    path: 'subscriptions/:id',
    name: 'Subscription Details',
    component: () => import('@/views/Subscriptions/ShowSubscription.vue'),
    props: true,
    meta: { breadcrumb: 'subscription_details', parent: 'Subscriptions' },
  },
];
