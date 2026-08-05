import { describe, expect, it } from 'vitest';
import StudentPerformanceSnapshotModel from '../student.performance.snapshot.model';

describe('StudentPerformanceSnapshotModel', () => {
  it('maps backend values without calculation', () => {
    const model = StudentPerformanceSnapshotModel.fromJson({
      current_plan: 'Premium',
      total_exams: 20,
    });

    expect(model.currentPlan).toBe('Premium');
    expect(model.totalExams).toBe(20);
  });
});
