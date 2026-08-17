import type { RouteRecordRaw } from '@/router/types';

export const blockReasonRoutes: RouteRecordRaw[] = [
  {
    path: 'block-reasons',
    name: 'Block Reasons',
    component: () => import('@/views/BlockReasons/IndexBlockReason.vue'),
    meta: { breadcrumb: 'block reasons' },
  },
  {
    path: 'block-reasons/add',
    name: 'Add Block Reason',
    component: () => import('@/views/BlockReasons/AddBlockReason.vue'),
    meta: { breadcrumb: 'add block reason', parent: 'Block Reasons' },
  },
  {
    path: 'block-reasons/edit/:id',
    name: 'Edit Block Reason',
    component: () => import('@/views/BlockReasons/EditBlockReason.vue'),
    props: true,
    meta: { breadcrumb: 'edit block reason', parent: 'Block Reasons' },
  },
];
