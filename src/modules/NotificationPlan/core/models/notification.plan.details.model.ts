import { StatusNotificationPlanEnum } from '../enums/status.notification.plan.enum';
import NotificationPlanActionModel from './notification.plan.action.model';

export interface NotificationPlanEmployeeModel {
  readonly id: number;
  readonly name: string;
}

export default class NotificationPlanDetailsModel {
  public readonly id: number;
  public readonly plan_title: string;
  public readonly employees: readonly NotificationPlanEmployeeModel[];
  public readonly actions: readonly NotificationPlanActionModel[];
  public readonly status: StatusNotificationPlanEnum;
  public readonly created_by: string;
  public readonly created_at: string;
  public readonly updated_by: string;
  public readonly updated_at: string;

  constructor(data: {
    id: number;
    plan_title: string;
    employees: NotificationPlanEmployeeModel[];
    actions: NotificationPlanActionModel[];
    status: StatusNotificationPlanEnum;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
  }) {
    this.id = data.id;
    this.plan_title = data.plan_title;
    this.employees = Object.freeze(
      data.employees.map((employee) => Object.freeze({ ...employee })),
    );
    this.actions = Object.freeze([...data.actions]);
    this.status = data.status;
    this.created_by = data.created_by;
    this.created_at = data.created_at;
    this.updated_by = data.updated_by;
    this.updated_at = data.updated_at;
    Object.freeze(this);
  }

  static fromJson(data: Record<string, unknown>): NotificationPlanDetailsModel {
    const employees = Array.isArray(data.employees) ? data.employees : [];
    const actions = Array.isArray(data.actions) ? data.actions : [];

    return new NotificationPlanDetailsModel({
      id: Number(data.id ?? 0),
      plan_title: String(data.plan_title ?? ''),
      employees: employees.map((employee) => {
        const value = employee as Record<string, unknown>;
        return { id: Number(value.id ?? 0), name: String(value.name ?? '') };
      }),
      actions: actions.map((action) =>
        NotificationPlanActionModel.fromJson(action as Record<string, unknown>),
      ),
      status:
        String(data.status) === StatusNotificationPlanEnum.active
          ? StatusNotificationPlanEnum.active
          : StatusNotificationPlanEnum.inactive,
      created_by: String(data.created_by ?? ''),
      created_at: String(data.created_at ?? ''),
      updated_by: String(data.updated_by ?? ''),
      updated_at: String(data.updated_at ?? ''),
    });
  }

  static readonly example = NotificationPlanDetailsModel.fromJson({
    id: 1,
    plan_title: 'Team Leader',
    employees: [{ id: 1, name: 'Portal Admin' }],
    actions: [{ action_ids: [1], message: 'A question was updated.' }],
    status: StatusNotificationPlanEnum.active,
    created_by: 'Portal Admin',
    created_at: '2026-09-02T09:20:42.000000Z',
    updated_by: 'Portal Admin',
    updated_at: '2026-09-02T09:20:42.000000Z',
  });
}
