import { describe, expect, it } from 'vitest';
import PlanModel, { PlanDurationTypeEnum, PlanStatusEnum } from '../plan.model';
import PlanLastUpdatedModel from '../plan.last.upadated.model';
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
      durationType: PlanDurationTypeEnum.MONTH,
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

  it('exposes a realistic example payload for the plan feature tree', () => {
    expect(PlanModel.example).toMatchObject({
      id: 1,
      title: 'Premium',
      price: 100,
      features: [
        {
          feature_type: PlanFeatureTypeEnum.REPORT,
          feature_title: 'Reports',
          status: true,
          feature_sub_type: [
            {
              sub_type: PlanFeatureSubTypeEnum.MAXIMUM_REPORTS_PER_STUDENT,
              status: true,
              limit: 5,
            },
          ],
        },
      ],
      lastUpdated: {
        lastupdatedBy: { id: 1, name: 'Mohab Mohamed' },
        date: '2023-01-01',
      },
    });
  });

  it('maps last-updated data from the API snake-case shape', () => {
    const value = PlanModel.fromJson({
      id: 8,
      last_updated: {
        last_updated_person: { id: 7, name: 'Alice' },
        last_updated_date: '2026-08-11',
      },
    });

    expect(value.lastUpdated).toMatchObject({
      lastupdatedBy: { id: 7, name: 'Alice' },
      date: '2026-08-11',
    });
  });

  it('builds a last-updated record even when the payload uses the direct example shape', () => {
    expect(() =>
      PlanLastUpdatedModel.fromJson({ lastupdatedBy: { id: 7, name: 'Alice' } }),
    ).not.toThrow();
    expect(
      PlanLastUpdatedModel.fromJson({ lastupdatedBy: { id: 7, name: 'Alice' } }),
    ).toMatchObject({
      lastupdatedBy: { id: 7, name: 'Alice' },
    });
  });
});
