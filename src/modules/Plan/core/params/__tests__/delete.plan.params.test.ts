import { describe, expect, it } from 'vitest';
import DeletePlanParams from '../delete.plan.params';

describe('DeletePlanParams', () => {
  it('maps the plan id', () => {
    expect(new DeletePlanParams(7).toMap()).toEqual({ subscription_plan_id: 7 });
  });
});
