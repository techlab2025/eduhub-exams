import { describe, expect, it } from 'vitest';
import ShowPlanParams from '../show.plan.params';

describe('ShowPlanParams', () => {
  it('maps the plan id and retains the locale option', () => {
    const params = new ShowPlanParams(4, true);
    expect(params.toMap()).toEqual({ plan_id: 4 });
    expect(params.allLocales).toBe(true);
  });
});
