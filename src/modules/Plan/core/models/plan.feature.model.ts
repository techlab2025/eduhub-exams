import { PlanFeatureTypeEnum } from '../enums/planType.enum';
import PlanFeatureSubTypeModel from './plan.sub.feature.model';

export default class PlanFeatureTypeModel {
  public readonly featureType: PlanFeatureTypeEnum;
  public readonly featureSubType: PlanFeatureSubTypeModel[];
  public readonly featuretitle?: string;
  public readonly status?: boolean;

  constructor(data: {
    featureType: PlanFeatureTypeEnum;
    featureSubType: PlanFeatureSubTypeModel[];
    featuretitle?: string;
    status?: boolean;
  }) {
    this.featureType = data.featureType;
    this.featureSubType = data.featureSubType;
    this.featuretitle = data.featuretitle;
    this.status = data.status;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>) {
    return new PlanFeatureTypeModel({
      featureType: Number(json.feature_type ?? json.id) as PlanFeatureTypeEnum,
      featureSubType: Array.isArray(json.feature_sub_type)
        ? json.feature_sub_type.map((subType: any) => PlanFeatureSubTypeModel.fromJson(subType))
        : [],
      featuretitle: json.feature_title as string | undefined,
      status: json.status === undefined ? true : Boolean(json.status),
    });
  }

  static readonly example = PlanFeatureTypeModel.fromJson({
    featureType: PlanFeatureTypeEnum.REPORT,
    featureSubType: [PlanFeatureSubTypeModel.example, PlanFeatureSubTypeModel.example],
    featuretitle: 'Example Feature',
    status: true,
  });
}
