import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { PlanDurationTypeEnum } from '../../enums/plan.duration.enum';
import { PlanStatusEnum } from '../../enums/plan.status.enum';
import { PlanFeatureSubTypeEnum, PlanFeatureTypeEnum } from '../../enums/planType.enum';
import AddPlanParams from '../add.plan.params';
import PlanFeatureParams from '../plan.features.params';
import PlanPricingParams from '../plan.pricing.params';
import PlanSubFeatureParams from '../plan.sub.features.params';

describe('AddPlanParams', () => {
  it('maps the plan request using API field names', () => {
    const params = new AddPlanParams({
      translations: new TranslationParams({ title: { en: 'Premium' } }),
      status: PlanStatusEnum.ACTIVE,
      highlightBadge: [2],
      pricing: [
        new PlanPricingParams({
          price: 50,
          duration: 1,
          durationType: PlanDurationTypeEnum.MONTH,
        }),
      ],
      hasTrail: true,
      trialDays: 3,
      features: [
        new PlanFeatureParams({
          featureType: PlanFeatureTypeEnum.REPORT,
          featureSubType: [
            new PlanSubFeatureParams({
              subType: PlanFeatureSubTypeEnum.MAXIMUM_REPORTS_PER_STUDENT,
              limit: 1,
            }),
          ],
        }),
      ],
    });

    expect(params.toMap()).toMatchObject({
      status: 1,
      highlight_badge: [2],
      has_trail: true,
      trail_days: 3,
      pricing: [{ price: 50, duration: 1, duration_type: 3 }],
      features: [
        {
          feature_type: 1,
          feature_sub_type: [{ sub_type: 5, limit: 1 }],
        },
      ],
    });
  });
});
