import TitleModel from '@/base/Core/Models/titleModel';
import NotificationPlanActionModel from './notification.plan.action.model';

const getDisplayName = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';

  const creator = value as Record<string, unknown>;
  const directName = creator.name ?? creator.title ?? creator.full_name ?? creator.fullName;
  if (directName) return String(directName);

  return [creator.first_name ?? creator.firstName, creator.last_name ?? creator.lastName]
    .filter(Boolean)
    .join(' ');
};

export default class NotificationPlanModel {
  public readonly notification_plan_id: number;
  public readonly notificationPlanId: number;
  public readonly title: string;
  public readonly is_active: boolean;
  public readonly isActive: boolean;
  public readonly actions: NotificationPlanActionModel[];
  public readonly employees: TitleModel[];
  public readonly hierarchies: TitleModel[];
  public readonly heirarchy: 0 | 1;
  public readonly createdBy: string;
  public readonly createdAt: string;

  constructor(data: {
    notificationPlanId: number;
    title: string;
    isActive: boolean;
    actions?: NotificationPlanActionModel[];
    employees?: TitleModel[];
    hierarchies?: TitleModel[];
    heirarchy?: 0 | 1;
    createdBy?: string;
    createdAt?: string;
  }) {
    this.notification_plan_id = data.notificationPlanId;
    this.notificationPlanId = data.notificationPlanId;
    this.title = data.title;
    this.is_active = data.isActive;
    this.isActive = data.isActive;
    this.actions = data.actions ?? [];
    this.employees = data.employees ?? [];
    this.hierarchies = data.hierarchies ?? [];
    this.heirarchy = data.heirarchy ?? (this.hierarchies.length ? 1 : 0);
    this.createdBy = data.createdBy ?? '';
    this.createdAt = data.createdAt ?? '';
    Object.freeze(this);
  }

  get id(): number {
    return this.notificationPlanId;
  }

  get status(): boolean {
    return this.isActive;
  }

  static fromJson(data: Record<string, unknown>): NotificationPlanModel {
    const activeValue = data.is_active ?? data.isActive ?? false;
    const actions = Array.isArray(data.actions) ? data.actions : [];
    const employees = Array.isArray(data.employees) ? data.employees : [];
    const hierarchies = Array.isArray(data.hierarchies) ? data.hierarchies : [];

    return new NotificationPlanModel({
      notificationPlanId: Number(data.notification_plan_id ?? data.id ?? 0),
      title: String(data.title ?? ''),
      isActive: activeValue === true || activeValue === 1 || activeValue === '1',
      actions: actions.map((action) =>
        NotificationPlanActionModel.fromJson(action as Record<string, unknown>),
      ),
      employees: employees.map((employee) =>
        TitleModel.fromMap(employee as Record<string, unknown>),
      ),
      hierarchies: hierarchies.map((hierarchy) =>
        TitleModel.fromMap(hierarchy as Record<string, unknown>),
      ),
      heirarchy: Number(data.heirarchy ?? (hierarchies.length ? 1 : 0)) === 1 ? 1 : 0,
      createdBy: getDisplayName(data.created_by ?? data.creator ?? data.createdBy),
      createdAt: String(data.created_at ?? data.createdAt ?? ''),
    });
  }

  static readonly example = new NotificationPlanModel({
    notificationPlanId: 1,
    title: 'Team Leader',
    isActive: true,
  });
}
