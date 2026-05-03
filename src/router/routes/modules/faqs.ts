import type { RouteRecordRaw } from '@/router/types';

export const faqsRoutes: RouteRecordRaw[] = [
  {
    path: 'faqs',
    name: 'Faqs',
    component: () => import('@/views/faqs/IndexFaqs.vue'),
    meta: { breadcrumb: 'Faqs' },
  },
  {
    path: 'faqs/add',
    name: 'FaqsAdd',
    component: () => import('@/views/faqs/AddFaqs.vue'),
    meta: { breadcrumb: 'Add FAQ' },
  },
  {
    path: 'faqs/:id/edit',
    name: 'FaqsEdit',
    component: () => import('@/views/faqs/EditFaqs.vue'),
    meta: { breadcrumb: 'Edit FAQ' },
  },
];
