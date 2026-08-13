const LIMITED_SUB_FEATURE_CODES = new Set(['1.5', '1.6', '2.3', '2.4', '3.3', '4.2', '5.4', '5.5']);

export class PlanSubFeatureCatalogModel {
  public readonly id: number;
  public readonly title: string;
  public readonly code: string;
  public readonly hasLimit: boolean;

  constructor(data: { id: number; title: string; code: string }) {
    this.id = data.id;
    this.title = data.title;
    this.code = data.code;
    this.hasLimit = LIMITED_SUB_FEATURE_CODES.has(data.code);
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanSubFeatureCatalogModel({
      id: Number(json.id ?? 0),
      title: String(json.title ?? ''),
      code: String(json.code ?? ''),
    });
  }
}

export default class PlanFeatureCatalogModel {
  public readonly id: number;
  public readonly title: string;
  public readonly code: number;
  public readonly subFeatures: PlanSubFeatureCatalogModel[];

  constructor(data: {
    id: number;
    title: string;
    code: number;
    subFeatures: PlanSubFeatureCatalogModel[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.code = data.code;
    this.subFeatures = data.subFeatures;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanFeatureCatalogModel({
      id: Number(json.id ?? 0),
      title: String(json.title ?? ''),
      code: Number(json.code ?? 0),
      subFeatures: Array.isArray(json.sub_features)
        ? json.sub_features.map((item) =>
            PlanSubFeatureCatalogModel.fromJson(item as Record<string, unknown>),
          )
        : [],
    });
  }
}
