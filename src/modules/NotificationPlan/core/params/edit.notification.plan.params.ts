import AddNotificationPlanParams from './add.notification.plan.params';
import type { NotificationPlanActionValueParam } from './notification.plan.action.value.param';

export default class EditNotificationPlanParams extends AddNotificationPlanParams {
  public notificationPlanId: number;

  constructor(
    notificationPlanId: number,
    title: string,
    actionValues: NotificationPlanActionValueParam[],
    employeeIds: number[] = [],
    hierarchyIds: number[] = [],
    isActive?: boolean,
    heirarchy: 0 | 1 = 0,
  ) {
    super(title, actionValues, employeeIds, hierarchyIds, isActive, heirarchy);
    this.notificationPlanId = notificationPlanId;
  }

  toMap(): Record<string, unknown> {
    return { notification_plan_id: this.notificationPlanId, ...super.toMap() };
  }
}
