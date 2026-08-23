import { describe, expect, it } from 'vitest';
import { QuestionBatchStatusEnum } from '../question.batch.status.enum';

describe('QuestionBatchStatusEnum', () => {
  it('provides the supported batch states', () => {
    expect(QuestionBatchStatusEnum.DRAFT).toBe('1');
    expect(QuestionBatchStatusEnum.REJECTED).toBe('4');
  });
});
