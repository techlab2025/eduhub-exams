import { expectTypeOf, it } from 'vitest';
import type { StudentPerformanceModel } from '../student.performance.model';

it('defines student performance data', () => {
  expectTypeOf<StudentPerformanceModel>().toMatchTypeOf<{
    totalPlacementTests: number;
    placementTestsThisMonth: number;
    totalPracticesPlan: number;
    totalPracticesPlanThisMonth: number;
  }>();
});
