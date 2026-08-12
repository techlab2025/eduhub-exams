import { describe, expect, it } from 'vitest';
import { StudentStatusEnum } from '../../models/student.model';
import { ChangeStudentStatusParams } from '../change.student.status.params';

describe('ChangeStudentStatusParams', () => {
  it('maps status and the optional block reason', () => {
    expect(new ChangeStudentStatusParams(6, StudentStatusEnum.BLOCK, 'policy').toMap()).toEqual({
      student_id: 6,
      status: '3',
      block_reason: 'policy',
    });
  });
});
