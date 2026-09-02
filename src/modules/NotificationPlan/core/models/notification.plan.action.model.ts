export default class NotificationPlanActionModel {
  public readonly value: number;
  public readonly name: string;
  public readonly label: string;
  public readonly subAction: unknown;
  public readonly displayedMessage: string;
  public readonly executorName: string;
  public readonly featureName: string;

  constructor(
    value: number,
    name: string,
    label: string,
    subAction: unknown = null,
    displayedMessage = '',
    executorName = '',
    featureName = '',
  ) {
    this.value = value;
    this.name = name;
    this.label = label;
    this.subAction = subAction;
    this.displayedMessage = displayedMessage;
    this.executorName = executorName;
    this.featureName = featureName;
    Object.freeze(this);
  }

  static fromJson(data: Record<string, unknown>): NotificationPlanActionModel {
    return new NotificationPlanActionModel(
      Number(data.value ?? 0),
      String(data.name ?? ''),
      String(data.label ?? ''),
      data.sub_action ?? null,
      typeof (data.displayed_message ?? data.message) === 'string'
        ? String(data.displayed_message ?? data.message)
        : '',
      String(data.executor_user_name ?? data.executor_name ?? ''),
      String(data.feature_name ?? data.feature ?? ''),
    );
  }
}
