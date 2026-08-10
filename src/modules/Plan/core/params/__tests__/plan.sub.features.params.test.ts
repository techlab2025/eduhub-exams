import { describe, expect, it } from 'vitest';
import PlanSubFeatureParams from '../plan.sub.features.params';

describe('PlanSubFeatureParams', () => {
  it('omits an unused optional limit', () => {
    expect(new PlanSubFeatureParams({ subType: 3 }).toMap()).toEqual({ sub_type: 3 });
  });
});
