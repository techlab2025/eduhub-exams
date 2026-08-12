import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { PlanStatusEnum } from '../enums/plan.status.enum';

export default class TogglePlanStatusParams implements Params {
  public planId: number;
  public status: PlanStatusEnum;

  public static readonly validation = new ClassValidation().setRules({
    planId: { required: true, min: 1 },
    status: { required: true },
  });

  constructor(data: { planId: number; status: PlanStatusEnum }) {
    this.planId = data.planId;
    this.status = data.status;
  }

  toMap(): Record<string, number> {
    return {
      subscription_plan_id: this.planId,
      status: this.status,
    };
  }

  validate() {
    return TogglePlanStatusParams.validation.validate(this);
  }

  validateOrThrow() {
    return TogglePlanStatusParams.validation.validateOrThrow(this);
  }
}
