import { describe, expect, it } from 'vitest';
import { PlanDurationTypeEnum } from '../plan.duration.enum';

describe('PlanDurationTypeEnum', () => {
  it('uses numeric API values', () => {
    expect(PlanDurationTypeEnum).toEqual({ DAY: 1, WEEK: 2, MONTH: 3, YEAR: 4 });
  });
});
