import type { RouteRecordRaw } from '@/router/types';
import EmployeeIcon from '@/shared/icons/BreadcrumbIcons/EmployeeIcon.vue';

export const placementsRoutes: RouteRecordRaw[] = [
  // {
  //   path: 'placements',
  //   name: 'Placements',
  //   component: () => import('@/views/Placement/IndexPlacement.vue'),
  //   meta: {
  //     breadcrumb: 'Placements',
  //     icon: EmployeeIcon,
  //   },
  // },
  {
    path: 'placement-configuration',
    name: 'Placement Configuration',
    component: () => import('@/views/Placement/AddPlacement.vue'),
    meta: {
      breadcrumb: 'Placement Configuration',
      icon: EmployeeIcon,
      parent: 'Placement Test',
    },
  },
  // {
  //   path: 'placements/edit/:id',
  //   name: 'Edit placement',
  //   component: () => import('@/views/Placement/EditPlacement.vue'),
  //   props: true,
  //   meta: {
  //     breadcrumb: 'Edit placement',
  //     icon: EmployeeIcon,
  //     parent: 'Placements',
  //   },
  // },
  {
    path: 'placements/show',
    name: 'Show placement',
    component: () => import('@/views/Placement/ShowPlacement.vue'),
    props: true,
    meta: {
      breadcrumb: 'Show placement',
      icon: EmployeeIcon,
      parent: 'Placements',
    },
  },
];
