import { describe, expect, it } from 'vitest';
import { PlanDurationTypeEnum } from '../../enums/plan.duration.enum';
import PlanPricingParams from '../plan.pricing.params';

describe('PlanPricingParams', () => {
  it('maps pricing fields', () => {
    expect(
      new PlanPricingParams({
        price: 10,
        duration: 2,
        durationType: PlanDurationTypeEnum.WEEK,
      }).toMap(),
    ).toEqual({ price: 10, duration: 2, duration_type: 2 });
  });

  it('omits unset pricing fields', () => {
    expect(new PlanPricingParams({}).toMap()).toEqual({});
  });
});
