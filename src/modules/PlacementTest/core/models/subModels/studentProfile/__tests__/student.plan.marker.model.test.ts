import { describe, expect, it } from 'vitest';
import StudentPlanMarkerModel from '../student.plan.marker.model';

describe('StudentPlanMarkerModel', () => {
  it('uses the marker data supplied by the backend', () => {
    const model = StudentPlanMarkerModel.fromJson({
      title: 'First Plan',
      exam_number: 2,
      tone: 'success',
    });

    expect(model.title).toBe('First Plan');
    expect(model.examNumber).toBe(2);
    expect(model.tone).toBe('success');
  });
});
