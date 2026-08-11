import { describe, expect, it } from 'vitest';
import { PlanStatusEnum } from '../../enums/plan.status.enum';
import TogglePlanStatusParams from '../toggle.plan.status.params';

describe('TogglePlanStatusParams', () => {
  it('maps the plan id and status to API keys', () => {
    const params = new TogglePlanStatusParams({
      planId: 12,
      status: PlanStatusEnum.Archived,
    });

    expect(params.toMap()).toEqual({ plan_id: 12, status: PlanStatusEnum.Archived });
    expect(params.validate().isValid).toBe(true);
  });
});
