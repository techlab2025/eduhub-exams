import { describe, expect, it } from 'vitest';
import { StudentStatusEnum } from '../../models/student.model';
import { ChangeStudentStatusParams } from '../change.student.status.params';

describe('ChangeStudentStatusParams', () => {
  it('maps block_reason_id as an array when blocking a student', () => {
    expect(
      new ChangeStudentStatusParams(
        6,
        StudentStatusEnum.BLOCK,
        12,
        'Policy violation: Repeated misuse',
      ).toMap(),
    ).toEqual({
      student_id: 6,
      status: '3',
      block_reason_id: [12],
      block_reason: 'Policy violation: Repeated misuse',
    });
  });

  it('omits block_reason_id for statuses other than block', () => {
    expect(
      new ChangeStudentStatusParams(6, StudentStatusEnum.ACTIVE, 12, 'Ignored reason').toMap(),
    ).toEqual({
      student_id: 6,
      status: '1',
    });
  });
});
