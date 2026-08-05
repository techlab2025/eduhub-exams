import { describe, expect, it } from 'vitest';
import StudentExamPerformanceModel from '../student.exam.performance.model';

describe('StudentExamPerformanceModel', () => {
  it('uses the tone supplied by the backend', () => {
    const model = StudentExamPerformanceModel.fromJson({
      exam_number: 1,
      score: 92,
      tone: 'success',
    });

    expect(model.examNumber).toBe(1);
    expect(model.score).toBe(92);
    expect(model.tone).toBe('success');
  });
});
