export default class NotificationPlanActionModel {
  public readonly value: number;
  public readonly name: string;
  public readonly label: string;
  public readonly subAction: unknown;

  constructor(value: number, name: string, label: string, subAction: unknown = null) {
    this.value = value;
    this.name = name;
    this.label = label;
    this.subAction = subAction;
    Object.freeze(this);
  }

  static fromJson(data: Record<string, unknown>): NotificationPlanActionModel {
    return new NotificationPlanActionModel(
      Number(data.value ?? 0),
      String(data.name ?? ''),
      String(data.label ?? ''),
      data.sub_action ?? null,
    );
  }
}
