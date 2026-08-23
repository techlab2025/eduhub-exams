import { describe, expect, it } from 'vitest';
import IndexQuestionBatchParams from '../index.question.batch.params';

describe('IndexQuestionBatchParams', () => {
  it('maps pagination and search fields', () => {
    expect(new IndexQuestionBatchParams('arabic', 2, 20, 1).toMap()).toMatchObject({
      word: 'arabic',
      with_pagination: 1,
      page: 2,
      per_page: 20,
    });
  });
});
