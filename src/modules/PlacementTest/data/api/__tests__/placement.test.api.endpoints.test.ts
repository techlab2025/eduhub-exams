import { describe, expect, it } from 'vitest';
import { PlacementTestEndpoints } from '../placement.test.api.endpoints';

describe('PlacementTestEndpoints', () => {
  it('contains the student profile endpoint', () => {
    expect(new PlacementTestEndpoints().showStudentProfile).toContain(
      'dashboard/show_placement_test_student',
    );
  });
});
