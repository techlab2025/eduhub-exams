import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { StatusNotificationPlanEnum } from '../enums/status.notification.plan.enum';
import type { NotificationPlanActionValueParam } from './notification.plan.action.value.param';

export default class AddNotificationPlanParams implements Params {
  public plan_title: string;
  public employee_ids: number[];
  public action: NotificationPlanActionValueParam[];
  public status?: StatusNotificationPlanEnum;

  public static readonly validation = new ClassValidation().setRules({
    plan_title: { required: true },
    employee_ids: { required: true },
    action: { required: true },
  });

  constructor(
    plan_title: string,
    employee_ids: number[],
    action: NotificationPlanActionValueParam[],
    status?: StatusNotificationPlanEnum,
  ) {
    this.plan_title = plan_title;
    this.employee_ids = employee_ids;
    this.action = action;
    this.status = status;
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      plan_title: this.plan_title,
      employee_ids: this.employee_ids,
      action: this.action,
    };
    if (this.status !== undefined) data.status = this.status;
    return data;
  }

  validate() {
    return AddNotificationPlanParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddNotificationPlanParams.validation.validateOrThrow(this);
  }
}
