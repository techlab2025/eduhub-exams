import { describe, expect, it } from 'vitest';
import StudentModel, { StudentStatusEnum } from '../student.model';
describe('StudentModel', () => {
  it('maps student responses and statistics', () => {
    expect(
      StudentModel.fromJson({ id: 5, name: 'Ali', serial: 'ST-5', status: '3', num_of_exams: 8 }),
    ).toMatchObject({ id: 5, status: StudentStatusEnum.BLOCK, examsCount: 8 });
    expect(
      StudentModel.statsFromJson({ total_students: 20, block_students: 2, blocked_students: 3 }),
    ).toMatchObject({ totalStudents: 20, blockedStudents: 3 });
  });
});
