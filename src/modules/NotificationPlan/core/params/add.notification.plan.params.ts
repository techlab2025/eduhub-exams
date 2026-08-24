import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { NotificationPlanActionValueParam } from './notification.plan.action.value.param';

export default class AddNotificationPlanParams implements Params {
  public title: string;
  public actionValues: NotificationPlanActionValueParam[];
  public employeeIds: number[];
  public hierarchyIds: number[];
  public isActive?: boolean;
  public heirarchy: 0 | 1;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true },
    actionValues: { required: true },
  });

  constructor(
    title: string,
    actionValues: NotificationPlanActionValueParam[],
    employeeIds: number[] = [],
    hierarchyIds: number[] = [],
    isActive?: boolean,
    heirarchy: 0 | 1 = 0,
  ) {
    this.title = title;
    this.actionValues = actionValues;
    this.employeeIds = employeeIds;
    this.hierarchyIds = hierarchyIds;
    this.isActive = isActive;
    this.heirarchy = heirarchy;
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      title: this.title,
      action_values: this.actionValues,
      heirarchy: this.heirarchy,
    };
    if (this.isActive !== undefined) data.is_active = this.isActive;
    if (this.employeeIds.length > 0) data.employee_ids = this.employeeIds;
    if (this.hierarchyIds.length > 0) data.hierarchy_ids = this.hierarchyIds;
    return data;
  }

  validate() {
    return AddNotificationPlanParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddNotificationPlanParams.validation.validateOrThrow(this);
  }
}
