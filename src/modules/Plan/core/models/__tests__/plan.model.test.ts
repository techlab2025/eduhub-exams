import { describe, expect, it } from 'vitest';
import PlanModel, { DurationTypeEnum, PlanStatusEnum } from '../plan.model';
import { PlanFeatureSubTypeEnum, PlanFeatureTypeEnum } from '../../enums/planType.enum';
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
      features: [
        {
          feature_id: 1,
          sub_features: [{ id: 5, status: true, limit: 2 }],
        },
      ],
    });
    expect(value).toMatchObject({
      id: 8,
      durationType: DurationTypeEnum.MONTH,
      status: PlanStatusEnum.ACTIVE,
      hasTrial: true,
      trialDays: 7,
      subscribers: 12,
      features: [
        {
          feature_type: PlanFeatureTypeEnum.REPORT,
          feature_sub_type: [
            {
              sub_type: PlanFeatureSubTypeEnum.MAXIMUM_REPORTS_PER_STUDENT,
              status: true,
              limit: 2,
            },
          ],
        },
      ],
    });
  });
});
