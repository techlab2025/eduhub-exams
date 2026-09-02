import type { RouteRecordRaw } from '@/router/types';
import EmployeeIcon from '@/shared/icons/BreadcrumbIcons/EmployeeIcon.vue';

export const roleRoutes: RouteRecordRaw[] = [
  {
    path: 'roles',
    name: 'Roles',
    component: () => import('@/views/Role/IndexRole.vue'),
    meta: { breadcrumb: 'title plural', icon: EmployeeIcon },
  },
  {
    path: 'roles/add',
    name: 'Add Role',
    component: () => import('@/views/Role/AddRole.vue'),
    meta: { breadcrumb: 'add title', icon: EmployeeIcon, parent: 'Roles' },
  },
  {
    path: 'roles/:id',
    name: 'Role Details',
    component: () => import('@/views/Role/ShowRole.vue'),
    props: true,
    meta: { breadcrumb: 'show title', icon: EmployeeIcon, parent: 'Roles' },
  },
  {
    path: 'roles/:id/edit',
    name: 'Edit Role',
    component: () => import('@/views/Role/EditRole.vue'),
    props: true,
    meta: { breadcrumb: 'edit title', icon: EmployeeIcon, parent: 'Roles' },
  },
];
