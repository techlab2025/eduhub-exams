import { describe, expect, it } from 'vitest';
import QuestionBatchCreatorModel from '../question.batch.creator.model';

describe('QuestionBatchCreatorModel', () => {
  it('maps creator name and id', () => {
    expect(QuestionBatchCreatorModel.fromJson({ id: 5, name: 'Reviewer' })).toMatchObject({
      id: 5,
      name: 'Reviewer',
    });
  });
});
