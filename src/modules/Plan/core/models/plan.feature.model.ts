import PlanSubFeatureModel from './plan.sub.feature.model';

export default class PlanFeatureModel {
  public readonly featureId: number;
  public readonly featureTitle: string;
  public readonly subFeatures: PlanSubFeatureModel[];

  constructor(data: {
    featureId: number;
    featureTitle: string;
    subFeatures: PlanSubFeatureModel[];
  }) {
    this.featureId = data.featureId;
    this.featureTitle = data.featureTitle;
    this.subFeatures = data.subFeatures;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanFeatureModel({
      featureId: Number(json.feature_id ?? 0),
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
