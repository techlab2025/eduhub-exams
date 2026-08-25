import type { RouteRecordRaw } from '@/router/types';
import EmployeeIcon from '@/shared/icons/BreadcrumbIcons/EmployeeIcon.vue';

export const roleRoutes: RouteRecordRaw[] = [
  {
    path: 'roles',
    name: 'Roles',
    component: () => import('@/views/Role/IndexRole.vue'),
    meta: { breadcrumb: 'role.title_plural', icon: EmployeeIcon },
  },
  {
    path: 'roles/add',
    name: 'Add Role',
    component: () => import('@/views/Role/AddRole.vue'),
    meta: { breadcrumb: 'role.add_title', icon: EmployeeIcon, parent: 'Roles' },
  },
  {
    path: 'roles/:id',
    name: 'Role Details',
    component: () => import('@/views/Role/ShowRole.vue'),
    props: true,
    meta: { breadcrumb: 'role.show_title', icon: EmployeeIcon, parent: 'Roles' },
  },
  {
    path: 'roles/:id/edit',
    name: 'Edit Role',
    component: () => import('@/views/Role/EditRole.vue'),
    props: true,
    meta: { breadcrumb: 'role.edit_title', icon: EmployeeIcon, parent: 'Roles' },
  },
];
