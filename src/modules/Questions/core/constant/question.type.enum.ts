export const QuestionTypeEnum = {
  mcq: 1,
  ranking: 2,
  true_false: 3,
  complate: 4,
  matching: 5,
} as const;

export type QuestionTypeEnum = (typeof QuestionTypeEnum)[keyof typeof QuestionTypeEnum];
