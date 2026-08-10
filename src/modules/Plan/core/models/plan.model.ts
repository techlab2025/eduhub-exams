import type { PlanFeatureSubTypeEnum, PlanFeatureTypeEnum } from '../enums/planType.enum';

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

export interface PlanFeatureSubTypeValue {
  sub_type: PlanFeatureSubTypeEnum;
  status?: boolean;
  limit?: number;
}

export interface PlanFeatureValue {
  feature_type: PlanFeatureTypeEnum;
  feature_sub_type: PlanFeatureSubTypeValue[];
  feature_title?: string;
  status?: boolean;
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

  static fromJson(json: Record<string, unknown>) {
    const lastUpdated = json.last_updated as Record<string, unknown> | undefined;

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
      Array.isArray(json.highlight_badge)
        ? (json.highlight_badge as Array<{ id: number; title: string }>)
        : [],
      Array.isArray(json.pricing) ? (json.pricing as PlanPricing[]) : [],
      Array.isArray(json.features)
        ? json.features.map((rawFeature: unknown) => {
            const feature = rawFeature as Record<string, unknown>;
            const rawSubTypes = Array.isArray(feature.feature_sub_type)
              ? feature.feature_sub_type
              : Array.isArray(feature.sub_features)
                ? feature.sub_features
                : [];

            return {
              feature_type: Number(
                feature.feature_type ?? feature.feature_id,
              ) as PlanFeatureTypeEnum,
              feature_title: feature.feature_title as string | undefined,
              status: feature.status === undefined ? true : Boolean(feature.status),
              feature_sub_type: rawSubTypes.map((rawSubType: unknown) => {
                const subType = rawSubType as Record<string, unknown>;
                return {
                  sub_type: Number(subType.sub_type ?? subType.id) as PlanFeatureSubTypeEnum,
                  status: subType.status === undefined ? true : Boolean(subType.status),
                  ...(subType.limit === undefined ? {} : { limit: Number(subType.limit) }),
                };
              }),
            };
          })
        : [],
      Number(json.subscribers ?? json['subscribers:'] ?? 0),
      String(json.created_at ?? ''),
      String(json.last_update_at ?? lastUpdated?.last_updated_date ?? ''),
    );
  }

  static readonly example = PlanModel.fromJson({ id: 1, title: 'Premium', price: 100 });
}
