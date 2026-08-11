import { expect, it } from 'vitest';
import { PlanDurationTypeEnum } from '../../enums/plan.duration.enum';
import PlanPricingModel from '../plan.pricing.model';

it('maps a pricing entry', () => {
  expect(
    PlanPricingModel.fromJson({ price: '499', duration: '1', duration_type: 3 }),
  ).toMatchObject({ price: 499, duration: 1, durationType: PlanDurationTypeEnum.MONTH });
});
