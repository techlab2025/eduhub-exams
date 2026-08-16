import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { PlanStatusEnum } from '../../enums/plan.status.enum';
import EditPlanParams from '../edit.plan.params';
import { PlanDurationTypeEnum } from '../../enums/plan.duration.enum';
import PlanPricingParams from '../plan.pricing.params';
import PlanFeatureParams from '../plan.features.params';
import PlanSubFeatureParams from '../plan.sub.features.params';
import { PlanFeatureTypeEnum } from '../../enums/planType.enum';

describe('EditPlanParams', () => {
  it('adds the plan id to the update request', () => {
    const params = new EditPlanParams({
      id: 9,
      translations: new TranslationParams({ title: { en: 'Updated' } }),
      status: PlanStatusEnum.ACTIVE,
      highlightBadge: [],
      pricing: [],
      hasTrail: false,
      trialDays: 0,
      numberOfSubjects: 8,
      features: [],
    });

    expect(params.toMap()).toMatchObject({
      subscription_plan_id: 9,
      status: 1,
      number_of_subjects: 8,
    });
  });

  it('maps and validates only pricing for a pricing edit', () => {
    const params = new EditPlanParams({
      id: 9,
      section: 'pricing',
      translations: new TranslationParams({}),
      status: PlanStatusEnum.ACTIVE,
      highlightBadge: [],
      pricing: [
        new PlanPricingParams({
          price: 20,
          duration: 1,
          durationType: PlanDurationTypeEnum.MONTH,
        }),
      ],
      hasTrail: false,
      trialDays: 0,
      numberOfSubjects: 8,
      features: [],
    });

    expect(params.toMap()).toEqual({
      subscription_plan_id: 9,
      pricing: [{ price: 20, duration: 1, duration_type: 3 }],
      has_trail: false,
      trail_days: 0,
    });
    expect(params.validate().isValid).toBe(true);
  });

  it('maps only translations and badges for a basic edit', () => {
    const params = new EditPlanParams({
      id: 9,
      section: 'basic',
      translations: new TranslationParams({
        title: { ar: 'خطة' },
        description: { en: 'Description' },
      }),
      status: PlanStatusEnum.ACTIVE,
      highlightBadge: [4],
      pricing: [],
      hasTrail: false,
      trialDays: 0,
      numberOfSubjects: 12,
      features: [],
    });

    expect(params.toMap()).toEqual({
      subscription_plan_id: 9,
      translations: {
        title: { ar: 'خطة' },
        description: { en: 'Description' },
      },
      highlight_badge: [4],
      number_of_subjects: 12,
    });
    expect(params.validate().isValid).toBe(true);
  });

  it('maps only features for a features edit', () => {
    const params = new EditPlanParams({
      id: 9,
      section: 'features',
      translations: new TranslationParams({}),
      status: PlanStatusEnum.ACTIVE,
      highlightBadge: [],
      pricing: [],
      hasTrail: false,
      trialDays: 0,
      numberOfSubjects: 8,
      features: [
        new PlanFeatureParams({
          featureType: PlanFeatureTypeEnum.REPORT,
          featureSubType: [
            new PlanSubFeatureParams({
              subType: '1.1',
            }),
          ],
        }),
      ],
    });

    expect(params.toMap()).toEqual({
      subscription_plan_id: 9,
      features: [{ feature_type: 1, feature_sub_type: [{ sub_type: '1.1' }] }],
    });
    expect(params.validate().isValid).toBe(true);
  });
});
