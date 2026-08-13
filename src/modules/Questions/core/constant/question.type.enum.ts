export const QuestionTypeEnum = {
  mcq: 1,
  true_false: 2,
  complate: 3,
  matching: 4,
  paragraph: 5,
  ranking: 6,
} as const;

export type QuestionTypeEnum = (typeof QuestionTypeEnum)[keyof typeof QuestionTypeEnum];
