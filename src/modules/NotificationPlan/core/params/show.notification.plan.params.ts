import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowNotificationPlanParams implements Params {
  public notification_plan_id: number;
  public static readonly validation = new ClassValidation().setRules({
    notification_plan_id: { required: true, min: 1 },
  });

  constructor(notification_plan_id: number) {
    this.notification_plan_id = notification_plan_id;
  }
  toMap(): Record<string, number> {
    return { notification_plan_id: this.notification_plan_id };
  }
  validate() {
    return ShowNotificationPlanParams.validation.validate(this);
  }
  validateOrThrow() {
    return ShowNotificationPlanParams.validation.validateOrThrow(this);
  }
}
