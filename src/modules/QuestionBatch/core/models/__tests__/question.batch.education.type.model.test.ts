import { describe, expect, it } from 'vitest';
import QuestionBatchEducationTypeModel from '../question.batch.education.type.model';

describe('QuestionBatchEducationTypeModel', () => {
  it('maps nested education children', () => {
    const model = QuestionBatchEducationTypeModel.fromJson({
      id: 1,
      title: 'Governmental',
      children: [{ id: 2, title: 'Primary' }],
    });
    expect(model.children[0]?.title).toBe('Primary');
  });
});
