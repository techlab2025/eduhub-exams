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
      translations: new TranslationParams({
        title: { en: 'Premium', ar: 'مميزة' },
        description: { en: 'Premium plan', ar: 'خطة مميزة' },
        question: { en: 'must not be sent' },
      }),
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
      numberOfSubjects: 8,
      features: [
        new PlanFeatureParams({
          featureType: PlanFeatureTypeEnum.REPORT,
          featureSubType: [
            new PlanSubFeatureParams({
              subType: PlanFeatureSubTypeEnum.SHOW_OVERALL_SCORE,
            }),
            new PlanSubFeatureParams({
              subType: PlanFeatureSubTypeEnum.MAXIMUM_REPORTS_PER_STUDENT,
              limit: 4,
            }),
            new PlanSubFeatureParams({
              subType: PlanFeatureSubTypeEnum.MAX_DOWNLOADS_PER_MONTH,
              limit: 5,
            }),
          ],
        }),
        new PlanFeatureParams({
          featureType: PlanFeatureTypeEnum.HOME_STUDY_SCHEDULE,
          featureSubType: [
            new PlanSubFeatureParams({
              subType: PlanFeatureSubTypeEnum.ALLOW_STUDENTS_TO_SET_REMINDERS,
            }),
            new PlanSubFeatureParams({
              subType: PlanFeatureSubTypeEnum.MAXIMUM_SCHEDULES_PER_DAY,
              limit: 1,
            }),
          ],
        }),
      ],
    });

    expect(params.toMap()).toEqual({
      translations: {
        title: { en: 'Premium', ar: 'مميزة' },
        description: { en: 'Premium plan', ar: 'خطة مميزة' },
      },
      status: 1,
      highlight_badge: [2],
      has_trail: true,
      trail_days: 3,
      number_of_subjects: 8,
      pricing: [{ price: 50, duration: 1, duration_type: 3 }],
      features: [
        {
          feature_type: 1,
          feature_sub_type: [{ sub_type: 2 }, { sub_type: 6, limit: 4 }, { sub_type: 7, limit: 5 }],
        },
        {
          feature_type: 13,
          feature_sub_type: [{ sub_type: 15 }, { sub_type: 16, limit: 1 }],
        },
      ],
    });
  });

  it('requires at least one complete pricing object', () => {
    const params = new AddPlanParams({
      translations: new TranslationParams({ title: { en: 'Premium' } }),
      status: PlanStatusEnum.ACTIVE,
      highlightBadge: [2],
      pricing: [
        new PlanPricingParams({
          price: 50,
          duration: 0,
          durationType: PlanDurationTypeEnum.MONTH,
        }),
      ],
      hasTrail: false,
      trialDays: 0,
      numberOfSubjects: 8,
      features: [
        new PlanFeatureParams({
          featureType: PlanFeatureTypeEnum.REPORT,
          featureSubType: [
            new PlanSubFeatureParams({
              subType: PlanFeatureSubTypeEnum.SHOW_OVERALL_SCORE,
            }),
          ],
        }),
      ],
    });

    expect(params.validate()).toEqual({
      isValid: false,
      errors: [
        {
          field: 'pricing',
          message: 'pricing must include at least one complete item',
        },
      ],
    });
  });

  it('omits incomplete and empty values from a draft payload', () => {
    const params = new AddPlanParams({
      translations: new TranslationParams({
        title: { en: 'Draft title', ar: '   ' },
        description: {},
      }),
      status: PlanStatusEnum.DRAFT,
      highlightBadge: [],
      pricing: [new PlanPricingParams({ durationType: PlanDurationTypeEnum.MONTH })],
      hasTrail: false,
      trialDays: 0,
      numberOfSubjects: 0,
      features: [],
    });

    expect(params.toMap()).toEqual({
      translations: { title: { en: 'Draft title' } },
      status: PlanStatusEnum.DRAFT,
    });
  });
});
