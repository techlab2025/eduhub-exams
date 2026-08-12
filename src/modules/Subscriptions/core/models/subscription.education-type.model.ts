export default class SubscriptionEducationTypeModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
  ) {
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new SubscriptionEducationTypeModel(Number(json.id ?? 0), String(json.title ?? ''));
  }
}
