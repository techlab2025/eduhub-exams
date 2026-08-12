import AddPlanParams from './add.plan.params';
import type TranslationParams from '@/modules/about/core/params/translation.params';
import type { PlanStatusEnum } from '../enums/plan.status.enum';
import type PlanFeatureParams from './plan.features.params';
import type PlanPricingParams from './plan.pricing.params';
import { ValidationError, type FieldError } from '@/base/Presentation/Utils/classValidation';

export type PlanEditSection = 'basic' | 'pricing' | 'features';

export default class EditPlanParams extends AddPlanParams {
  public id: number;
  public section?: PlanEditSection;

  constructor(data: {
    id: number;
    translations: TranslationParams;
    status: PlanStatusEnum;
    highlightBadge: number[];
    pricing: PlanPricingParams[];
    hasTrail: boolean;
    trialDays: number;
    features: PlanFeatureParams[];
    numberOfSubjects?: number;
    section?: PlanEditSection;
  }) {
    super(data);
    this.id = data.id;
    this.section = data.section;
  }

  toMap(): Record<string, unknown> {
    const fullMap = super.toMap();
    if (this.section === 'basic') {
      return {
        subscription_plan_id: this.id,
        translations: fullMap.translations,
        highlight_badge: fullMap.highlight_badge,
        ...(fullMap.number_of_subjects !== undefined && {
          number_of_subjects: fullMap.number_of_subjects,
        }),
      };
    }
    if (this.section === 'pricing') {
      return {
        subscription_plan_id: this.id,
        pricing: fullMap.pricing,
        has_trail: this.hasTrail,
        trail_days: this.trialDays,
      };
    }
    if (this.section === 'features') {
      return {
        subscription_plan_id: this.id,
        features: fullMap.features,
      };
    }
    return { subscription_plan_id: this.id, ...fullMap };
  }

  validate(): { isValid: boolean; errors: FieldError[] } {
    const result = super.validate();
    const fieldsBySection: Record<PlanEditSection, string[]> = {
      basic: ['translations', 'highlightBadge', 'numberOfSubjects'],
      pricing: ['pricing', 'hasTrail', 'trialDays'],
      features: ['features'],
    };
    const fields = this.section ? fieldsBySection[this.section] : undefined;
    const errors = fields
      ? result.errors.filter((error) => fields.includes(error.field))
      : result.errors;
    return { isValid: errors.length === 0, errors };
  }

  validateOrThrow(): void {
    const result = this.validate();
    if (!result.isValid) new ValidationError(result.errors).openDialog();
  }
}
