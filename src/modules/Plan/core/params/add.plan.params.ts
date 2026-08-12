import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';
import { PlanStatusEnum } from '../enums/plan.status.enum';
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
  public numberOfSubjects?: number;

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
    numberOfSubjects: {
      required: true,
      custom: (value: number) =>
        (Number.isInteger(Number(value)) && Number(value) >= 1) ||
        'number of subjects must be a positive integer',
    },
  });

  constructor(data: {
    translations: TranslationParams;
    status: PlanStatusEnum;
    highlightBadge: number[];
    pricing: PlanPricingParams[];
    hasTrail: boolean;
    trialDays: number;
    features: PlanFeatureParams[];
    numberOfSubjects?: number;
  }) {
    this.translations = data.translations;
    this.status = data.status;
    this.highlightBadge = data.highlightBadge;
    this.pricing = data.pricing;
    this.hasTrail = data.hasTrail;
    this.trialDays = data.trialDays;
    this.features = data.features;
    this.numberOfSubjects = data.numberOfSubjects;
  }

  toMap(): Record<string, unknown> {
    const compactLocales = (value?: Record<string, string>) =>
      Object.fromEntries(
        Object.entries(value ?? {}).filter(([, text]) => String(text).trim().length > 0),
      );
    const title = compactLocales(this.translations.title);
    const description = compactLocales(this.translations.description);
    const translations = {
      ...(Object.keys(title).length > 0 && { title }),
      ...(Object.keys(description).length > 0 && { description }),
    };
    const pricing = this.pricing
      .filter(
        (item) =>
          Number.isFinite(Number(item.price)) &&
          Number(item.price) >= 0 &&
          Number.isFinite(Number(item.duration)) &&
          Number(item.duration) > 0 &&
          Boolean(item.durationType),
      )
      .map((item) => item.toMap());
    const features = this.features
      .filter((item) => item.featureSubType.length > 0)
      .map((item) => item.toMap());
    const isDraft = this.status === PlanStatusEnum.DRAFT;

    return {
      ...(Object.keys(translations).length > 0 && { translations }),
      status: this.status,
      ...(this.highlightBadge?.length > 0 && {
        highlight_badge: this.highlightBadge,
      }),
      ...(pricing.length > 0 && { pricing }),
      ...(!isDraft || this.hasTrail ? { has_trail: this.hasTrail } : {}),
      ...(this.hasTrail && this.trialDays > 0 ? { trail_days: this.trialDays } : {}),
      ...(features.length > 0 && { features }),
      ...(Number.isInteger(Number(this.numberOfSubjects)) && Number(this.numberOfSubjects) >= 1
        ? { number_of_subjects: Number(this.numberOfSubjects) }
        : {}),
    };
  }

  validate() {
    return AddPlanParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddPlanParams.validation.validateOrThrow(this);
  }
}
