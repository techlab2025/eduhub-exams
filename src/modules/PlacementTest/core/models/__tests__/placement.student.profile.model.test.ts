import { describe, expect, it } from 'vitest';
import PlacementStudentProfileModel from '../placement.student.profile.model';
import ShowPlcaementTestModel from '../show.placement.test.model';

describe('PlacementStudentProfileModel', () => {
  it('maps only the fields returned by the student profile endpoint', () => {
    const model = PlacementStudentProfileModel.fromJson({
      id: 1,
      student: { id: 7, name: 'Ahmed', image: '' },
      e_c_subject: { id: 284, title: 'Math', full_title: 'Primary -> Math' },
      student_code: 'ST-7',
      student_status: 'active',
      classification_path: ['Governmental', 'Primary'],
      performance_snapshot: {
        current_plan: 'Premium',
        total_exams: 3,
        total_plans_created: 2,
      },
      exam_analysis: {
        best_score: 92,
        lowest_score: 48,
        average_score: 74,
      },
      exam_performance: [{ exam_number: 1, label: 'First', score: 92, tone: 'success' }],
      skill_progress: [{ exam_number: 1, percentage: 35 }],
      plan_markers: [{ title: 'First Plan', exam_number: 1, tone: 'success' }],
      exam_history: [{ id: 11, score: 92, subject: 'Math', status: 'excellent' }],
    });

    expect(model.placementTest).toBeInstanceOf(ShowPlcaementTestModel);
    expect(model.placementTest.student?.id).toBe(7);
    expect(model.studentCode).toBe('ST-7');
    expect(model.performanceSnapshot?.currentPlan).toBe('Premium');
    expect(model.examAnalysis?.bestScore).toBe(92);
    expect(model.examPerformance[0].tone).toBe('success');
    expect(model.skillProgress[0].percentage).toBe(35);
    expect(model.examHistory[0].status).toBe('excellent');
  });

  it('keeps example data separate from endpoint mapping', () => {
    const model = PlacementStudentProfileModel.fromJson({
      id: 1,
      student: { id: 7, name: 'Real Student' },
    });

    expect(model.placementTest.student?.name).toBe('Real Student');
    expect(model.examPerformance).toEqual([]);
    expect(model.skillProgress).toEqual([]);
    expect(model.planMarkers).toEqual([]);
    expect(model.examHistory).toEqual([]);
  });
});
