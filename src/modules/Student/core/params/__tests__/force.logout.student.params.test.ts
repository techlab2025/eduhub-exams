import { describe, expect, it } from 'vitest';
import { ForceLogoutStudentParams } from '../force.logout.student.params';

describe('ForceLogoutStudentParams', () => {
  it('maps the student identifier', () => {
    expect(new ForceLogoutStudentParams(9).toMap()).toEqual({ student_id: 9 });
  });
});
