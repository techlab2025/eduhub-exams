import { describe, expect, it } from 'vitest';
import StudentModel, { StudentStatusEnum } from '../student.model';
describe('StudentModel', () => {
  it('maps the documented student list response', () => {
    expect(
      StudentModel.fromJson({ id: 5, name: 'Ali', serial: 'ST-5', status: '3', num_of_exams: 8 }),
    ).toMatchObject({ id: 5, status: StudentStatusEnum.BLOCK, examsCount: 8 });
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
    });
  });
});
