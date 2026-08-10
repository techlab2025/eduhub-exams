import { describe, expect, it } from 'vitest';
import { StudentStatusEnum } from '../../models/student.model';
import { ChangeStudentStatusParams, IndexStudentParams } from '../student.params';
describe('student params', () => {
  it('maps filters and status actions', () => {
    expect(
      new IndexStudentParams('ali', 1, 10, { planId: 4, status: StudentStatusEnum.ACTIVE }).toMap(),
    ).toMatchObject({ word: 'ali', plan_id: 4, status: '1' });
    expect(new ChangeStudentStatusParams(6, StudentStatusEnum.BLOCK, 'policy').toMap()).toEqual({
      student_id: 6,
      status: '3',
      block_reason: 'policy',
    });
  });
});
