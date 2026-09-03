import type { RouteRecordRaw } from '@/router/types';

export const notificationPlanRoutes: RouteRecordRaw[] = [
  {
    path: 'notification-plans',
    name: 'Notification Plans',
    component: () => import('@/views/NotificationPlan/IndexNotificationPlan.vue'),
    meta: {
      breadcrumb: 'notification_plan.title',
      headerAction: {
        icon: 'plus',
        label: 'notification_plan.add',
        to: '/notification-plans/add',
      },
    },
  },
  {
    path: 'notification-plans/add',
    name: 'Add Notification Plan',
    component: () => import('@/views/NotificationPlan/AddNotificationPlan.vue'),
    meta: { breadcrumb: 'notification_plan.add', parent: 'Notification Plans' },
  },
  {
    path: 'notification-plans/edit/:id',
    name: 'Edit Notification Plan',
    component: () => import('@/views/NotificationPlan/EditNotificationPlan.vue'),
    props: true,
    meta: { breadcrumb: 'notification_plan.edit', parent: 'Notification Plans' },
  },
  {
    path: 'notification-plans/:id',
    name: 'Notification Plan Details',
    component: () => import('@/views/NotificationPlan/DetailsNotificationPlan.vue'),
    props: true,
    meta: { breadcrumb: 'notification_plan.view_title', parent: 'Notification Plans' },
  },
];
