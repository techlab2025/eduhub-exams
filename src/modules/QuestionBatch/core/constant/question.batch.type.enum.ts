export const QuestionBatchTypeEnum = {
  ANY_TYPE: '1',
  MCQ: '2',
  TRUE_FALSE: '3',
  RANKING: '4',
  COMPLETION: '5',
  MATCHING: '6',
} as const;

export type QuestionBatchTypeEnum =
  (typeof QuestionBatchTypeEnum)[keyof typeof QuestionBatchTypeEnum];
