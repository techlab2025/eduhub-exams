export const QuestionBatchDifficultyEnum = {
  ANY_DIFFICULTY: '1',
  EASY: '2',
  MEDIUM: '3',
  HARD: '4',
} as const;

export type QuestionBatchDifficultyEnum =
  (typeof QuestionBatchDifficultyEnum)[keyof typeof QuestionBatchDifficultyEnum];
