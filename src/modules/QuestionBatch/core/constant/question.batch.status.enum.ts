export const QuestionBatchStatusEnum = {
  DRAFT: '1',
  READY_FOR_REVIEW: '2',
  APPROVED: '3',
  REJECTED: '4',
} as const;

export type QuestionBatchStatusEnum =
  (typeof QuestionBatchStatusEnum)[keyof typeof QuestionBatchStatusEnum];
