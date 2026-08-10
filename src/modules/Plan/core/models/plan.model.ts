export const PlanStatusEnum = { ACTIVE: '1', INACTIVE: '2', ARCHIVED: '3', DRAFT: '4' } as const;
export type PlanStatusEnum = (typeof PlanStatusEnum)[keyof typeof PlanStatusEnum];
export const DurationTypeEnum = { DAY: '1', WEEK: '2', MONTH: '3', YEAR: '4' } as const;
export type DurationTypeEnum = (typeof DurationTypeEnum)[keyof typeof DurationTypeEnum];
export const LastUpdatedEnum = {
  TODAY: '1',
  LAST_7_DAYS: '2',
  LAST_30_DAYS: '3',
  LAST_3_MONTHS: '4',
  CUSTOM: '5',
} as const;
export type LastUpdatedEnum = (typeof LastUpdatedEnum)[keyof typeof LastUpdatedEnum];

export interface PlanPricing {
  price: number;
  duration: number;
  duration_type: DurationTypeEnum;
}

export interface PlanFeatureValue {
  feature_id: number;
  feature_title?: string;
  status?: boolean;
  limit?: number;
  sub_features?: PlanFeatureValue[];
}

export default class PlanModel {
  public readonly id: number;
  public readonly title: unknown;
  public readonly description: unknown;
  public readonly duration: number;
  public readonly durationType: DurationTypeEnum;
  public readonly price: number;
  public readonly status: PlanStatusEnum;
  public readonly hasTrial: boolean;
  public readonly trialDays: number;
  public readonly highlightBadges: Array<{ id: number; title: string }>;
  public readonly pricing: PlanPricing[];
  public readonly features: PlanFeatureValue[];
  public readonly subscribers: number;
  public readonly createdAt: string;
  public readonly lastUpdatedAt: string;

  constructor(
    id: number,
    title: unknown,
    description: unknown,
    duration: number,
    durationType: DurationTypeEnum,
    price: number,
    status: PlanStatusEnum,
    hasTrial: boolean,
    trialDays: number,
    highlightBadges: Array<{ id: number; title: string }>,
    pricing: PlanPricing[],
    features: PlanFeatureValue[],
    subscribers: number,
    createdAt: string,
    lastUpdatedAt: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.durationType = durationType;
    this.price = price;
    this.status = status;
    this.hasTrial = hasTrial;
    this.trialDays = trialDays;
    this.highlightBadges = highlightBadges;
    this.pricing = pricing;
    this.features = features;
    this.subscribers = subscribers;
    this.createdAt = createdAt;
    this.lastUpdatedAt = lastUpdatedAt;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>) {
    return new PlanModel(
      Number(json.id ?? json.plan_id),
      json.title ?? '',
      json.description ?? '',
      Number(json.duration ?? 0),
      String(json.duration_type ?? DurationTypeEnum.MONTH) as DurationTypeEnum,
      Number(json.price ?? 0),
      String(json.status ?? PlanStatusEnum.DRAFT) as PlanStatusEnum,
      Boolean(json.has_trail ?? json.has_trial),
      Number(json.trail_days ?? json.trial_days ?? 0),
      Array.isArray(json.highlight_badge) ? json.highlight_badge : [],
      Array.isArray(json.pricing) ? json.pricing : [],
      Array.isArray(json.features) ? json.features : [],
      Number(json.subscribers ?? json['subscribers:'] ?? 0),
      String(json.created_at ?? ''),
      String(json.last_update_at ?? json.last_updated?.last_updated_date ?? ''),
    );
  }

  static readonly example = PlanModel.fromJson({ id: 1, title: 'Premium', price: 100 });
}
