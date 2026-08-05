import { describe, expect, it } from 'vitest';
import StudentExamHistoryModel from '../student.exam.history.model';

describe('StudentExamHistoryModel', () => {
  it('does not derive the status from the score', () => {
    const model = StudentExamHistoryModel.fromJson({ id: 1, score: 95, status: 'review' });

    expect(model.score).toBe(95);
    expect(model.status).toBe('review');
  });
});
