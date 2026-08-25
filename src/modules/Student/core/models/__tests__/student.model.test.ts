import { describe, expect, it } from 'vitest';
import StudentModel, { StudentStatusEnum } from '../student.model';
describe('StudentModel', () => {
  it('maps the documented student list response', () => {
    expect(
      StudentModel.fromJson({
        id: 5,
        name: 'Ali',
        image: 'student.png',
        serial: 'ST-5',
        education_type: { id: 2, title: 'National' },
        current_plan: { id: 7, title: 'Premium' },
        num_of_exams: 8,
        num_of_study_plan: 3,
        status: '3',
        join_date: '2026-01-05',
        has_active_plan: false,
      }),
    ).toMatchObject({
      id: 5,
      name: 'Ali',
      image: 'student.png',
      serial: 'ST-5',
      educationType: { id: 2, title: 'National' },
      currentPlan: { id: 7, title: 'Premium' },
      examsCount: 8,
      studyPlanCount: 3,
      status: StudentStatusEnum.BLOCK,
      joinDate: '2026-01-05',
      hasActiveSubscription: true,
    });
  });

  it('uses the active-plan flag when there is no current plan', () => {
    const model = StudentModel.fromJson({
      id: 7,
      current_plan: null,
      has_active_plan: 1,
    });

    expect(model.currentPlan).toBeNull();
    expect(model.hasActiveSubscription).toBe(true);
  });

  it('maps the nested education type hierarchy', () => {
    const model = StudentModel.fromJson({
      id: 6,
      education_type: {
        id: 202,
        title: 'LEFT1',
        children: [
          {
            id: 203,
            title: 'LEFT2',
            children: [{ id: 207, title: 'OVER 1', children: [] }],
          },
        ],
      },
    });

    expect(model.educationType).toEqual({
      id: 202,
      title: 'LEFT1',
      children: [
        {
          id: 203,
          title: 'LEFT2',
          children: [{ id: 207, title: 'OVER 1', children: [] }],
        },
      ],
    });
  });

  it('provides a complete example for the students table', () => {
    expect(StudentModel.example).toMatchObject({
      id: 1,
      name: 'Ahmed Hawam',
      educationType: { title: 'Governmental' },
      educationStage: { title: 'Primary' },
      grade: { title: 'First' },
      currentPlan: { title: 'Basic' },
      examsCount: 20,
      studyPlanCount: 20,
      status: StudentStatusEnum.ACTIVE,
      joinDate: '09-05-2022',
      hasActiveSubscription: true,
    });
  });
});
