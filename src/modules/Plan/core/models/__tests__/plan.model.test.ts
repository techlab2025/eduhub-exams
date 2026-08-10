import { describe, expect, it } from 'vitest';
import PlanModel, { DurationTypeEnum, PlanStatusEnum } from '../plan.model';
describe('PlanModel', () => {
  it('maps list and detail fields', () => {
    const value = PlanModel.fromJson({
      id: 8,
      title: 'Premium',
      duration: 2,
      duration_type: '3',
      price: 99,
      status: '1',
      has_trail: true,
      trail_days: 7,
      subscribers: 12,
    });
    expect(value).toMatchObject({
      id: 8,
      durationType: DurationTypeEnum.MONTH,
      status: PlanStatusEnum.ACTIVE,
      hasTrial: true,
      trialDays: 7,
      subscribers: 12,
    });
  });
});
