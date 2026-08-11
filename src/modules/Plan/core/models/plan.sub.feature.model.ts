import type { PlanFeatureSubTypeEnum } from '../enums/planType.enum';

export default class PlanSubFeatureModel {
  public readonly id: PlanFeatureSubTypeEnum;
  public readonly status: boolean;
  public readonly limit?: number;

  constructor(data: { id: PlanFeatureSubTypeEnum; status: boolean; limit?: number }) {
    this.id = data.id;
    this.status = data.status;
    this.limit = data.limit;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanSubFeatureModel({
      id: Number(json.id ?? 0) as PlanFeatureSubTypeEnum,
      status: Boolean(json.status),
      ...(json.limit === undefined || json.limit === null ? {} : { limit: Number(json.limit) }),
    });
  }

  static readonly example = PlanSubFeatureModel.fromJson({ id: 1, status: true });
}
