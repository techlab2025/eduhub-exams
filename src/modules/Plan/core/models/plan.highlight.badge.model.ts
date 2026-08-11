export default class PlanHighlightBadgeModel {
  public readonly id: number;
  public readonly title: string;

  constructor(data: { id: number; title: string }) {
    this.id = data.id;
    this.title = data.title;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanHighlightBadgeModel({
      id: Number(json.id ?? 0),
      title: String(json.title ?? ''),
    });
  }

  static readonly example = PlanHighlightBadgeModel.fromJson({ id: 1, title: 'Most Popular' });
}
