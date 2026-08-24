import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowNotificationPlanParams implements Params {
  public notificationPlanId: number;
  public static readonly validation = new ClassValidation().setRules({
    notificationPlanId: { required: true, min: 1 },
  });

  constructor(notificationPlanId: number) {
    this.notificationPlanId = notificationPlanId;
  }
  toMap(): Record<string, number> {
    return { notification_plan_id: this.notificationPlanId };
  }
  validate() {
    return ShowNotificationPlanParams.validation.validate(this);
  }
  validateOrThrow() {
    return ShowNotificationPlanParams.validation.validateOrThrow(this);
  }
}
