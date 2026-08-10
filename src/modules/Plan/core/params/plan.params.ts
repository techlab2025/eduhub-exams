import IndexParams from '@/base/Core/Params/indexParams';
import type Params from '@/base/Core/Params/params';
import type TranslationParams from '@/modules/about/core/params/translation.params';
import type {
  DurationTypeEnum,
  LastUpdatedEnum,
  PlanFeatureValue,
  PlanPricing,
  PlanStatusEnum,
} from '../models/plan.model';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export interface PlanFilters {
  userId?: number;
  fromPrice?: number;
  toPrice?: number;
  duration?: string;
  hasTrial?: boolean;
  status?: PlanStatusEnum;
  fromDate?: string;
  toDate?: string;
  lastUpdated?: LastUpdatedEnum;
}

export class IndexPlanParams extends IndexParams {
  public filters: PlanFilters;
  constructor(word = '', page = 1, perPage = 10, filters: PlanFilters = {}) {
    super(word, page, perPage, 1);
    this.filters = filters;
  }
  toMap() {
    return {
      ...super.toMap(),
      user_id: this.filters.userId,
      from_price: this.filters.fromPrice,
      to_price: this.filters.toPrice,
      duration: this.filters.duration,
      has_trail: this.filters.hasTrial,
      status: this.filters.status,
      from_date: this.filters.fromDate,
      to_date: this.filters.toDate,
      last_updated: this.filters.lastUpdated,
    };
  }
}

export interface PlanPayload {
  translations: TranslationParams;
  duration: number;
  durationType: DurationTypeEnum;
  price: number;
  status: PlanStatusEnum;
  highlightBadges: number[];
  pricing: PlanPricing[];
  hasTrial: boolean;
  trialDays: number;
  features: PlanFeatureValue[];
}

export class StorePlanParams implements Params {
  public payload: PlanPayload;
  private static readonly validation = new ClassValidation();
  constructor(payload: PlanPayload) {
    this.payload = payload;
  }
  toMap() {
    return {
      translations: this.payload.translations.toMap(),
      duration: this.payload.duration,
      duration_type: this.payload.durationType,
      price: this.payload.price,
      status: this.payload.status,
      highlight_badge: this.payload.highlightBadges,
      pricing: this.payload.pricing,
      has_trail: this.payload.hasTrial,
      trail_days: this.payload.trialDays,
      features: this.payload.features,
    };
  }
  validate() {
    return StorePlanParams.validation.validate(this);
  }
  validateOrThrow() {
    return StorePlanParams.validation.validateOrThrow(this);
  }
}

export class ShowPlanParams implements Params {
  public id: number;
  public allLocales: boolean;
  private static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });
  constructor(id: number, allLocales = false) {
    this.id = id;
    this.allLocales = allLocales;
  }
  toMap() {
    return { plan_id: this.id };
  }
  validate() {
    return ShowPlanParams.validation.validate(this);
  }
  validateOrThrow() {
    return ShowPlanParams.validation.validateOrThrow(this);
  }
}

export class UpdatePlanParams extends StorePlanParams {
  public id: number;
  constructor(id: number, payload: PlanPayload) {
    super(payload);
    this.id = id;
  }
  toMap() {
    return { plan_id: this.id, ...super.toMap() };
  }
}

export class DeletePlanParams extends ShowPlanParams {}
