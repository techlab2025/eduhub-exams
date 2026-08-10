import { describe, expect, it } from 'vitest';
import { StudentEndpoints } from '../student.api.endpoints';
describe('StudentEndpoints', () => {
  it('registers all student endpoints', () => {
    const value = new StudentEndpoints();
    expect(value.index).toContain('fetch_students');
    expect(value.show).toContain('show_student_details');
    expect(value.stats).toContain('fetch_students_statics');
    expect(value.changeStatus).toContain('change_student_status');
    expect(value.forceLogout).toContain('force_logout_student');
  });
});
