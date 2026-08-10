import AddPlanParams from './add.plan.params';
import type TranslationParams from '@/modules/about/core/params/translation.params';
import type { PlanStatusEnum } from '../enums/plan.status.enum';
import type PlanFeatureParams from './plan.features.params';
import type PlanPricingParams from './plan.pricing.params';

export default class EditPlanParams extends AddPlanParams {
  public id: number;

  constructor(data: {
    id: number;
    translations: TranslationParams;
    status: PlanStatusEnum;
    highlightBadge: number[];
    pricing: PlanPricingParams[];
    hasTrail: boolean;
    trialDays: number;
    features: PlanFeatureParams[];
  }) {
    super(data);
    this.id = data.id;
  }

  toMap(): Record<string, unknown> {
    return { plan_id: this.id, ...super.toMap() };
  }
}
