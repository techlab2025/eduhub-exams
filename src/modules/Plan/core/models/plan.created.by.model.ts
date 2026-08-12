export default class PlanCreatedByModel {
  public readonly id: number;
  public readonly title: string;

  constructor(data: { id: number; title: string }) {
    this.id = data.id;
    this.title = data.title;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanCreatedByModel({
      id: Number(json.id ?? 0),
      title: String(json.name ?? json.title ?? ''),
    });
  }

  static readonly example = PlanCreatedByModel.fromJson({ id: 1, title: 'Ahmed Hawam' });
}
