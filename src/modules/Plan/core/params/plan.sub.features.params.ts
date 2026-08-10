import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class PlanSubFeatureParams implements Params {
  public subType: number;
  public limit?: number;

  public static readonly validation = new ClassValidation().setRules({
    subType: { required: true },
    limit: { required: false },
  });

  constructor(data: { subType: number; limit?: number }) {
    this.subType = data.subType;
    this.limit = data.limit;
  }

  toMap(): Record<string, unknown> {
    return {
      sub_type: this.subType,
      ...(this.limit === undefined ? {} : { limit: this.limit }),
    };
  }

  validate() {
    return PlanSubFeatureParams.validation.validate(this);
  }

  validateOrThrow() {
    return PlanSubFeatureParams.validation.validateOrThrow(this);
  }
}
