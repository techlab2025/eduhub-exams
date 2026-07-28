export const QuestionStatusEnum = {
  created: 1,
  notreviewed: 2,
  REJECTED: 3,
  aproved: 4,
  revision: 5,
  archive: 6

} as const;

export type QuestionStatusEnum = (typeof QuestionStatusEnum)[keyof typeof QuestionStatusEnum];
