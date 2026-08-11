import { PlanFeatureSubTypeEnum } from '../enums/planType.enum';

export default class PlanFeatureSubTypeModel {
  public readonly subtype: PlanFeatureSubTypeEnum;
  public readonly status?: boolean;
  public readonly limit?: number;

  constructor(data: { subtype: PlanFeatureSubTypeEnum; status?: boolean; limit?: number }) {
    this.subtype = data.subtype;
    this.status = data.status;
    this.limit = data.limit;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>) {
    return new PlanFeatureSubTypeModel({
      subtype: Number(json.subtype ?? json.id) as PlanFeatureSubTypeEnum,
      status: json.status === undefined ? true : Boolean(json.status),
      limit: json.limit === undefined ? undefined : Number(json.limit),
    });
  }

  static readonly example = PlanFeatureSubTypeModel.fromJson({
    subtype: PlanFeatureSubTypeEnum.ALLOW_REPORT_DOWNLOAD,
    status: true,
    limit: 5,
  });
}
