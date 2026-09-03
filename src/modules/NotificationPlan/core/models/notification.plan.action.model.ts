export default class NotificationPlanActionModel {
  public readonly action_ids: readonly number[];
  public readonly message: string;

  constructor(action_ids: number[], message: string) {
    this.action_ids = Object.freeze([...action_ids]);
    this.message = message;
    Object.freeze(this);
  }

  static fromJson(data: Record<string, unknown>): NotificationPlanActionModel {
    const action_ids = Array.isArray(data.action_ids)
      ? data.action_ids
          .map((actionId) => Number(actionId))
          .filter((actionId) => Number.isFinite(actionId))
      : [];

    return new NotificationPlanActionModel(action_ids, String(data.message ?? ''));
  }
}
