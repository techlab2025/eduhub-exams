import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';
import type { PlanStatusEnum } from '../enums/plan.status.enum';
import type PlanPricingParams from './plan.pricing.params';
import type PlanFeatureParams from './plan.features.params';

export default class AddPlanParams implements Params {
  public translations: TranslationParams;
  public status: PlanStatusEnum;
  public highlightBadge: number[];
  public pricing: PlanPricingParams[];
  public hasTrail: boolean;
  public trialDays: number;
  public features: PlanFeatureParams[];

  public static readonly validation = new ClassValidation().setRules({
    translations: { required: true },
    status: { required: true },
    highlightBadge: { required: true },
    pricing: {
      required: true,
      custom: (value: PlanPricingParams[]) =>
        value.some(
          (item) =>
            Number.isFinite(Number(item.price)) &&
            Number(item.price) >= 0 &&
            Number.isFinite(Number(item.duration)) &&
            Number(item.duration) > 0 &&
            Boolean(item.durationType),
        ) || 'pricing must include at least one complete item',
    },
    hasTrail: { required: true },
    trialDays: { required: true },
    features: { required: true },
  });

  constructor(data: {
    translations: TranslationParams;
    status: PlanStatusEnum;
    highlightBadge: number[];
    pricing: PlanPricingParams[];
    hasTrail: boolean;
    trialDays: number;
    features: PlanFeatureParams[];
  }) {
    this.translations = data.translations;
    this.status = data.status;
    this.highlightBadge = data.highlightBadge;
    this.pricing = data.pricing;
    this.hasTrail = data.hasTrail;
    this.trialDays = data.trialDays;
    this.features = data.features;
  }

  toMap(): Record<string, unknown> {
    return {
      translations: {
        title: this.translations.title,
        description: this.translations.description,
      },
      status: this.status,
      highlight_badge: this.highlightBadge,
      pricing: this.pricing.map((item) => item.toMap()),
      has_trail: this.hasTrail,
      trail_days: this.trialDays,
      features: this.features.map((item) => item.toMap()),
    };
  }

  validate() {
    return AddPlanParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddPlanParams.validation.validateOrThrow(this);
  }
}
