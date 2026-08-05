import { describe, expect, it } from 'vitest';
import ShowPlacementStudentParams from '../show.placement.student.params';

describe('ShowPlacementStudentParams', () => {
  it('maps the route student id to the endpoint parameter', () => {
    const params = new ShowPlacementStudentParams(7);

    expect(params.studentId).toBe(7);
    expect(params.toMap()).toEqual({ student_id: 7 });
    expect(params.validate().isValid).toBe(true);
  });
});
