import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { DurationTypeEnum, PlanStatusEnum } from '../../models/plan.model';
import { PlanFeatureSubTypeEnum, PlanFeatureTypeEnum } from '../../enums/planType.enum';
import { StorePlanParams } from '../plan.params';
describe('plan params', () => {
  it('maps the nested store payload', () => {
    const value = new StorePlanParams({
      translations: new TranslationParams({ title: { en: 'Premium' } }),
      duration: 1,
      durationType: DurationTypeEnum.MONTH,
      price: 50,
      status: PlanStatusEnum.ACTIVE,
      highlightBadges: [2],
      pricing: [{ price: 50, duration: 1, duration_type: DurationTypeEnum.MONTH }],
      hasTrial: true,
      trialDays: 3,
      features: [
        {
          feature_type: PlanFeatureTypeEnum.REPORT,
          feature_sub_type: [{ sub_type: PlanFeatureSubTypeEnum.SHOW_OVERALL_SCORE }],
        },
      ],
    }).toMap();
    expect(value).toMatchObject({
      duration_type: '3',
      highlight_badge: [2],
      has_trail: true,
      trail_days: 3,
      features: [
        {
          feature_type: PlanFeatureTypeEnum.REPORT,
          feature_sub_type: [{ sub_type: PlanFeatureSubTypeEnum.SHOW_OVERALL_SCORE }],
        },
      ],
    });
  });
});
