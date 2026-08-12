import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { PlanDurationTypeEnum } from '../enums/plan.duration.enum';

export default class PlanPricingParams implements Params {
  public price?: number;
  public duration?: number;
  public durationType?: PlanDurationTypeEnum;

  public static readonly validation = new ClassValidation().setRules({
    price: { required: true },
    duration: { required: true },
    durationType: { required: true },
  });

  constructor(data: { price?: number; duration?: number; durationType?: PlanDurationTypeEnum }) {
    this.price = data.price;
    this.duration = data.duration;
    this.durationType = data.durationType;
  }

  toMap(): Record<string, unknown> {
    return {
      ...(this.price !== undefined && { price: this.price }),
      ...(this.duration !== undefined && { duration: this.duration }),
      ...(this.durationType !== undefined && { duration_type: this.durationType }),
    };
  }

  validate() {
    return PlanPricingParams.validation.validate(this);
  }

  validateOrThrow() {
    return PlanPricingParams.validation.validateOrThrow(this);
  }
}
