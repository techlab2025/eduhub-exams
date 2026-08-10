import type { RouteRecordRaw } from '@/router/types';
export const highlightBadgeRoutes: RouteRecordRaw[] = [
  {
    path: 'highlight-badges',
    name: 'Highlight Badges',
    component: () => import('@/views/HighlightBadge/IndexHighlightBadge.vue'),
    meta: { breadcrumb: 'highlight_badges' },
  },
  {
    path: 'highlight-badges/add',
    name: 'Add Highlight Badge',
    component: () => import('@/views/HighlightBadge/AddHighlightBadge.vue'),
    meta: { breadcrumb: 'add_highlight_badge', parent: 'Highlight Badges' },
  },
  {
    path: 'highlight-badges/edit/:id',
    name: 'Edit Highlight Badge',
    component: () => import('@/views/HighlightBadge/EditHighlightBadge.vue'),
    props: true,
    meta: { breadcrumb: 'edit_highlight_badge', parent: 'Highlight Badges' },
  },
];
