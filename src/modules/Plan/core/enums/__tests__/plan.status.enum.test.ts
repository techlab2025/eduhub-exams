import { describe, expect, it } from 'vitest';
import { PlanStatusEnum } from '../plan.status.enum';

describe('PlanStatusEnum', () => {
  it('uses numeric API values', () => {
    expect(PlanStatusEnum).toEqual({ ACTIVE: 1, deactivated: 2, Archived: 3, DRAFT: 4 });
  });
});
