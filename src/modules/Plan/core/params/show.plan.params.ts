import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowPlanParams implements Params {
  public id: number;
  public allLocales: boolean;

  private static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });

  constructor(id: number, allLocales = false) {
    this.id = id;
    this.allLocales = allLocales;
  }

  toMap(): Record<string, unknown> {
    return { plan_id: this.id };
  }

  validate() {
    return ShowPlanParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowPlanParams.validation.validateOrThrow(this);
  }
}
