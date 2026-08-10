export const PlanFeatureTypeEnum = { SWITCH: '1', NUMBER: '2' } as const;
export type PlanFeatureTypeEnum = (typeof PlanFeatureTypeEnum)[keyof typeof PlanFeatureTypeEnum];

export type PlanFeatureLocalizedField =
  | Record<string, string>
  | Array<Record<string, string>>
  | string;

export default class PlanFeatureModel {
  public readonly id: number;
  public readonly title: PlanFeatureLocalizedField;
  public readonly description: PlanFeatureLocalizedField;
  public readonly type: PlanFeatureTypeEnum;
  public readonly parentId: number | null;

  constructor(
    id: number,
    title: PlanFeatureLocalizedField,
    description: PlanFeatureLocalizedField,
    type: PlanFeatureTypeEnum,
    parentId: number | null,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.parentId = parentId;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanFeatureModel(
      Number(json.id ?? json.plan_feature_id),
      (json.title ?? '') as PlanFeatureLocalizedField,
      (json.description ?? '') as PlanFeatureLocalizedField,
      String(json.plan_feature_type ?? PlanFeatureTypeEnum.SWITCH) as PlanFeatureTypeEnum,
      json.parent_id == null ? null : Number(json.parent_id),
    );
  }

  static readonly example = new PlanFeatureModel(
    1,
    'Exams',
    'Access to exams',
    PlanFeatureTypeEnum.SWITCH,
    null,
  );
}
