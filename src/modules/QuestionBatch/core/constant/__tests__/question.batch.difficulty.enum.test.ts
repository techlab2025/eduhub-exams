import { describe, expect, it } from 'vitest';
import { QuestionBatchDifficultyEnum } from '../question.batch.difficulty.enum';

describe('QuestionBatchDifficultyEnum', () => {
  it('matches the API values', () => {
    expect(Object.values(QuestionBatchDifficultyEnum)).toEqual(['1', '2', '3', '4']);
  });
});
