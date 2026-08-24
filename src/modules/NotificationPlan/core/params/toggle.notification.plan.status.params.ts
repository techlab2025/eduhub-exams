import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ToggleNotificationPlanStatusParams implements Params {
  public notificationPlanId: number;
  public isActive: boolean;
  public static readonly validation = new ClassValidation().setRules({
    notificationPlanId: { required: true, min: 1 },
    isActive: { required: true },
  });

  constructor(notificationPlanId: number, isActive: boolean) {
    this.notificationPlanId = notificationPlanId;
    this.isActive = isActive;
  }
  toMap(): Record<string, number | boolean> {
    return { notification_plan_id: this.notificationPlanId, is_active: this.isActive };
  }
  validate() {
    return ToggleNotificationPlanStatusParams.validation.validate(this);
  }
  validateOrThrow() {
    return ToggleNotificationPlanStatusParams.validation.validateOrThrow(this);
  }
}
