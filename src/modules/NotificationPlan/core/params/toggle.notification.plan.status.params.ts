import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { StatusNotificationPlanEnum } from '../enums/status.notification.plan.enum';

export default class ToggleNotificationPlanStatusParams implements Params {
  public notification_plan_id: number;
  public status: StatusNotificationPlanEnum;
  public static readonly validation = new ClassValidation().setRules({
    notification_plan_id: { required: true, min: 1 },
    status: { required: true },
  });

  constructor(notification_plan_id: number, status: StatusNotificationPlanEnum) {
    this.notification_plan_id = notification_plan_id;
    this.status = status;
  }
  toMap(): Record<string, number | StatusNotificationPlanEnum> {
    return { notification_plan_id: this.notification_plan_id, status: this.status };
  }
  validate() {
    return ToggleNotificationPlanStatusParams.validation.validate(this);
  }
  validateOrThrow() {
    return ToggleNotificationPlanStatusParams.validation.validateOrThrow(this);
  }
}
