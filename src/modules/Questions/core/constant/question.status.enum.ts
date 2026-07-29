export const QuestionStatusEnum = {
  CREATED : 1,
  APPROVED : 2,
  REJECTED : 3,
  DRAFT : 4,
  NOT_REVIEW : 5,
  ARCHIVED : 6,
  REVISION : 7 , 

} as const;

export type QuestionStatusEnum = (typeof QuestionStatusEnum)[keyof typeof QuestionStatusEnum];
