import { describe, expect, it } from 'vitest';
import StudentExamAnalysisModel from '../student.exam.analysis.model';

describe('StudentExamAnalysisModel', () => {
  it('maps backend values without calculation', () => {
    const model = StudentExamAnalysisModel.fromJson({ best_score: 92, average_score: 74 });

    expect(model.bestScore).toBe(92);
    expect(model.averageScore).toBe(74);
  });
});
