export default class PlanSubFeatureModel {
  public readonly id: number;
  public readonly status: boolean;
  public readonly limit: number;

  constructor(data: { id: number; status: boolean; limit: number }) {
    this.id = data.id;
    this.status = data.status;
    this.limit = data.limit;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanSubFeatureModel({
      id: Number(json.id ?? 0),
      status: Boolean(json.status),
      limit: Number(json.limit ?? 0),
    });
  }

  static readonly example = PlanSubFeatureModel.fromJson({ id: 1, status: true, limit: 0 });
}
