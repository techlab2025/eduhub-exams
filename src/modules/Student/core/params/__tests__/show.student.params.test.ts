import { describe, expect, it } from 'vitest';
import { ShowStudentParams } from '../show.student.params';

describe('ShowStudentParams', () => {
  it('maps the student identifier', () => {
    expect(new ShowStudentParams(6).toMap()).toEqual({ student_id: 6 });
  });
});
