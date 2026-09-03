import AddNotificationPlanParams from './add.notification.plan.params';
import type { StatusNotificationPlanEnum } from '../enums/status.notification.plan.enum';
import type { NotificationPlanActionValueParam } from './notification.plan.action.value.param';

export default class EditNotificationPlanParams extends AddNotificationPlanParams {
  public notification_plan_id: number;

  constructor(
    notification_plan_id: number,
    plan_title: string,
    employee_ids: number[],
    action: NotificationPlanActionValueParam[],
    status?: StatusNotificationPlanEnum,
  ) {
    super(plan_title, employee_ids, action, status);
    this.notification_plan_id = notification_plan_id;
  }

  toMap(): Record<string, unknown> {
    return { notification_plan_id: this.notification_plan_id, ...super.toMap() };
  }
}
