import { describe, expect, it } from 'vitest';
import { StudentStatusEnum } from '../../models/student.model';
import { IndexStudentParams } from '../index.student.params';

describe('IndexStudentParams', () => {
  it('maps the documented list filters', () => {
    expect(
      new IndexStudentParams('ali', 2, 20, {
        educationTypeId: 3,
        year: 2026,
        planId: 4,
        status: StudentStatusEnum.ACTIVE,
        joinDateFrom: '2026-01-01',
        joinDateTo: '2026-12-31',
      }).toMap(),
    ).toEqual({
      word: 'ali',
      with_pagination: 1,
      page: 2,
      per_page: 20,
      education_type_id: 3,
      year: 2026,
      plan_id: 4,
      status: '1',
      join_date_from: '2026-01-01',
      join_date_to: '2026-12-31',
    });
  });
});
