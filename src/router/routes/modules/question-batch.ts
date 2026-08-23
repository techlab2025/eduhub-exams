import type { RouteRecordRaw } from '@/router/types';
import EmployeeIcon from '@/shared/icons/BreadcrumbIcons/EmployeeIcon.vue';

export const questionBatchRoutes: RouteRecordRaw[] = [
  {
    path: 'question-batches',
    name: 'Question Batches',
    component: () => import('@/views/QuestionBatch/IndexQuestionBatch.vue'),
    meta: {
      breadcrumb: 'Question Batches',
      icon: EmployeeIcon,
    },
  },
  {
    path: 'question-batches/generate',
    name: 'Generate Question Batch',
    component: () => import('@/views/QuestionBatch/GenerateQuestionBatch.vue'),
    meta: {
      breadcrumb: 'Generate Question Batch',
      icon: EmployeeIcon,
      parent: 'Question Batches',
    },
  },
];
