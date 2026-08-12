export default class SubscriptionEducationTypeModel {
  public readonly id: number;
  public readonly title: string;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new SubscriptionEducationTypeModel(Number(json.id ?? 0), String(json.title ?? ''));
  }
}
