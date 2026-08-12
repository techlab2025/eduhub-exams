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
      id: Number(json.sub_feature_id ?? json.id ?? 0),
      status: Boolean(json.is_active ?? json.status),
      limit: Number(json.limit ?? 0),
    });
  }

  static readonly example = PlanSubFeatureModel.fromJson({ id: 1, is_active: true, limit: 0 });
}
