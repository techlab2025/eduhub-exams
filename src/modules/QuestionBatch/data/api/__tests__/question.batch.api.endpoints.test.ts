import { describe, expect, it } from 'vitest';
import { QuestionBatchEndpoints } from '../question.batch.api.endpoints';

describe('QuestionBatchEndpoints', () => {
  it('uses the question batch dashboard endpoints', () => {
    const endpoints = new QuestionBatchEndpoints();
    expect(endpoints.index).toContain('fetch_question_batches');
    expect(endpoints.store).toContain('store_question_batch');
  });
});
