import { StatusNotificationPlanEnum } from '../enums/status.notification.plan.enum';

export default class NotificationPlanModel {
  public readonly id: number;
  public readonly title: string;
  public readonly recipients_number: number;
  public readonly actions_number: number;
  public readonly status: StatusNotificationPlanEnum;
  public readonly created_by: string;
  public readonly created_at: string;

  constructor(data: {
    id: number;
    title: string;
    recipients_number: number;
    actions_number: number;
    status: StatusNotificationPlanEnum;
    created_by: string;
    created_at: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.recipients_number = data.recipients_number;
    this.actions_number = data.actions_number;
    this.status = data.status;
    this.created_by = data.created_by;
    this.created_at = data.created_at;
    Object.freeze(this);
  }

  static fromJson(data: Record<string, unknown>): NotificationPlanModel {
    return new NotificationPlanModel({
      id: Number(data.id ?? 0),
      title: String(data.title ?? ''),
      recipients_number: Number(data.recipients_number ?? 0),
      actions_number: Number(data.actions_number ?? 0),
      status:
        String(data.status) === StatusNotificationPlanEnum.active
          ? StatusNotificationPlanEnum.active
          : StatusNotificationPlanEnum.inactive,
      created_by: String(data.created_by ?? ''),
      created_at: String(data.created_at ?? ''),
    });
  }

  static readonly example = new NotificationPlanModel({
    id: 1,
    title: 'Team Leader',
    recipients_number: 2,
    actions_number: 1,
    status: StatusNotificationPlanEnum.active,
    created_by: 'Portal Admin',
    created_at: '2026-09-02T09:20:42.000000Z',
  });
}
