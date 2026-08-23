import { describe, expect, it } from 'vitest';
import { QuestionBatchTypeEnum } from '../question.batch.type.enum';

describe('QuestionBatchTypeEnum', () => {
  it('matches the documented generation types', () => {
    expect(Object.values(QuestionBatchTypeEnum)).toEqual(['1', '2', '3', '4', '5', '6']);
  });
});
