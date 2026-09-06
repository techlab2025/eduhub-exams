import { describe, expect, it } from 'vitest';
import ShowQuestionBatchParams from '../show.question.batch.params';

describe('ShowQuestionBatchParams', () => {
  it('maps the selected batch id to the show endpoint contract', () => {
    expect(new ShowQuestionBatchParams(17).toMap()).toEqual({ question_batch_id: 17 });
  });

  it('rejects an invalid batch id', () => {
    expect(new ShowQuestionBatchParams(0).validate().isValid).toBe(false);
  });
});
