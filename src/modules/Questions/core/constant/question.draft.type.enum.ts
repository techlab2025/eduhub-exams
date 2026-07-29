export const QuestionDraftTypeEnum = {
  notDraft: 0,
  draft: 1,

} as const;

export type QuestionDraftTypeEnum = (typeof QuestionDraftTypeEnum)[keyof typeof QuestionDraftTypeEnum];
