import { describe, expect, it } from 'vitest';
import { StudentStatusEnum } from '../../models/student.model';
import { IndexStudentParams } from '../index.student.params';

describe('IndexStudentParams', () => {
  it('maps the documented list filters', () => {
    expect(
      new IndexStudentParams('ali', 2, 20, {
        educationTypeId: 3,
        planId: 4,
        status: StudentStatusEnum.ACTIVE,
      }).toMap(),
    ).toMatchObject({
      word: 'ali',
      page: 2,
      per_page: 20,
      education_type_id: 3,
      plan_id: 4,
      status: '1',
    });
  });
});
