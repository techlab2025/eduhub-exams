export const NumberOfQuestionTypeEnum = {
  ANY_NUMBER: '1',
  SPECIFIC_NUMBER: '2',
} as const;

export type NumberOfQuestionTypeEnum =
  (typeof NumberOfQuestionTypeEnum)[keyof typeof NumberOfQuestionTypeEnum];
