import { describe, expect, it } from 'vitest';
import QuestionBatchEducationChildModel from '../question.batch.education.child.model';

describe('QuestionBatchEducationChildModel', () => {
  it('maps a child option', () => {
    expect(QuestionBatchEducationChildModel.fromJson({ id: '2', title: 'Primary' })).toEqual({
      id: 2,
      title: 'Primary',
    });
  });
});
