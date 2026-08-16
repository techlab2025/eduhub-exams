import PlanSubFeatureModel from './plan.sub.feature.model';

export default class PlanFeatureModel {
  public readonly featureId: number;
  public readonly featureCode: string;
  public readonly featureTitle: string;
  public readonly subFeatures: PlanSubFeatureModel[];

  constructor(data: {
    featureId: number;
    featureCode: string;
    featureTitle: string;
    subFeatures: PlanSubFeatureModel[];
  }) {
    this.featureId = data.featureId;
    this.featureCode = data.featureCode;
    this.featureTitle = data.featureTitle;
    this.subFeatures = data.subFeatures;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanFeatureModel({
      featureId: Number(json.feature_id ?? 0),
      featureCode: String(json.feature_type ?? json.feature_code ?? json.code ?? ''),
      featureTitle: String(json.feature_title ?? ''),
      subFeatures: Array.isArray(json.sub_features)
        ? json.sub_features.map((item) =>
            PlanSubFeatureModel.fromJson(item as Record<string, unknown>),
          )
        : [],
    });
  }

  static readonly example = PlanFeatureModel.fromJson({
    feature_id: 1,
    feature_title: 'Analytical Reports',
    sub_features: [{ id: 1, status: true, limit: 0 }],
  });
}
