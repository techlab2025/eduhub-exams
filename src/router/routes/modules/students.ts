import type { RouteRecordRaw } from '@/router/types';
export const studentRoutes: RouteRecordRaw[] = [
  {
    path: 'students',
    name: 'Students',
    component: () => import('@/views/Student/IndexStudents.vue'),
    meta: { breadcrumb: 'students' },
  },
  {
    path: 'students/:id',
    name: 'Student Details',
    component: () => import('@/views/Student/ShowStudent.vue'),
    props: true,
    meta: { breadcrumb: 'Student Profile', parent: 'Students' },
  },
];
