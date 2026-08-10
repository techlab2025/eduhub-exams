import IndexParams from '@/base/Core/Params/indexParams';
import type Params from '@/base/Core/Params/params';
import type TranslationParams from '@/modules/about/core/params/translation.params';
import type { PlanFeatureTypeEnum } from '../models/planFeature.model';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export class IndexPlanFeatureParams extends IndexParams {}

export interface PlanFeaturePayload {
  translations: TranslationParams;
  parentId?: number | null;
  type: PlanFeatureTypeEnum;
}

export class StorePlanFeatureParams implements Params {
  public payload: PlanFeaturePayload;
  private static readonly validation = new ClassValidation();
  constructor(payload: PlanFeaturePayload) {
    this.payload = payload;
  }
  toMap() {
    return {
      translations: this.payload.translations.toMap(),
      parent_id: this.payload.parentId ?? null,
      plan_feature_type: this.payload.type,
    };
  }
  validate() {
    return StorePlanFeatureParams.validation.validate(this);
  }
  validateOrThrow() {
    return StorePlanFeatureParams.validation.validateOrThrow(this);
  }
}

export class ShowPlanFeatureParams implements Params {
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
    return { plan_feature_id: this.id };
  }
  validate() {
    return ShowPlanFeatureParams.validation.validate(this);
  }
  validateOrThrow() {
    return ShowPlanFeatureParams.validation.validateOrThrow(this);
  }
}

export class UpdatePlanFeatureParams extends StorePlanFeatureParams {
  public id: number;
  constructor(id: number, payload: PlanFeaturePayload) {
    super(payload);
    this.id = id;
  }
  toMap() {
    return { plan_feature_id: this.id, ...super.toMap() };
  }
}

export class DeletePlanFeatureParams extends ShowPlanFeatureParams {}
