import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type PlanSubFeatureParams from './plan.sub.features.params';

export default class PlanFeatureParams implements Params {
  public featureType: string;
  public featureSubType: PlanSubFeatureParams[];

  public static readonly validation = new ClassValidation().setRules({
    featureType: { required: true },
    featureSubType: { required: true },
  });

  constructor(data: { featureType: string; featureSubType: PlanSubFeatureParams[] }) {
    this.featureType = data.featureType;
    this.featureSubType = data.featureSubType;
  }

  toMap(): Record<string, unknown> {
    return {
      feature_type: this.featureType,
      feature_sub_type: this.featureSubType.map((item) => item.toMap()),
    };
  }

  validate() {
    return PlanFeatureParams.validation.validate(this);
  }

  validateOrThrow() {
    return PlanFeatureParams.validation.validateOrThrow(this);
  }
}
