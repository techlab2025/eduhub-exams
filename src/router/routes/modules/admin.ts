import type { RouteRecordRaw } from '@/router/types';
import AdminIcon from '@/shared/icons/SidebarIcons/SettingIcon.vue';

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admins',
    component: () => import('@/views/Admin/IndexAdmin.vue'),
    meta: {
      breadcrumb: 'Admins',
      icon: AdminIcon,
    },
  },
  {
    path: '/admin/add',
    name: 'Add Admin',
    component: () => import('@/views/Admin/AddAdmin.vue'),
    meta: {
      breadcrumb: 'Add Admin',
      icon: AdminIcon,
      parent: 'Admins',
    },
  },
  {
    path: '/admin/edit/:id',
    name: 'Edit Admin',
    component: () => import('@/views/Admin/EditAdmin.vue'),
    props: true,
    meta: {
      breadcrumb: 'Edit Admin',
      icon: AdminIcon,
      parent: 'Admins',
    },
  },
];
