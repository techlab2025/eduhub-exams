import { describe, expect, it } from 'vitest';
import { PlanStatusEnum } from '../plan.status.enum';

describe('PlanStatusEnum', () => {
  it('uses numeric API values', () => {
    expect(PlanStatusEnum).toEqual({ ACTIVE: 1, INACTIVE: 2, ARCHIVED: 3, DRAFT: 4 });
  });
});
