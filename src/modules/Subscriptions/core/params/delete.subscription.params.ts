import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export class DeleteSubscriptionParams implements Params {
  public id: number;
  private static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });
  constructor(id: number) {
    this.id = id;
  }
  toMap() {
    return { subscription_id: this.id };
  }
  validate() {
    return DeleteSubscriptionParams.validation.validate(this);
  }
  validateOrThrow() {
    return DeleteSubscriptionParams.validation.validateOrThrow(this);
  }
}
