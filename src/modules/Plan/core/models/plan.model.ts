import { PlanDurationTypeEnum } from '../enums/plan.duration.enum';
import { PlanFeatureSubTypeEnum, PlanFeatureTypeEnum } from '../enums/planType.enum';
import type PlanPricingModel from './plan.pricing.model';
import { PlanStatusEnum } from '../enums/plan.status.enum';
import type PlanFeatureTypeModel from './plan.feature.model';
import PlanLastUpdatedModel from './plan.last.upadated.model';


export default class PlanModel {
  public readonly id: number;
  public readonly title: unknown;
  public readonly description: unknown;
  public readonly duration: number;
  public readonly durationType: PlanDurationTypeEnum;
  public readonly price: number;
  public readonly status: PlanStatusEnum;
  public readonly hasTrial: boolean;
  public readonly trialDays: number;
  public readonly highlightBadges: Array<{ id: number; title: string }>;
  public readonly pricing: PlanPricingModel[];
  public readonly features: PlanFeatureTypeModel[];
  public readonly subscribers: number;
  public readonly createdAt: string;
  public readonly lastUpdated: PlanLastUpdatedModel;

  constructor(data: {
    id: number;
    title: unknown;
    description: unknown;
    duration: number;
    durationType: PlanDurationTypeEnum;
    price: number;
    status: PlanStatusEnum;
    hasTrial: boolean;
    trialDays: number;
    highlightBadges: Array<{ id: number; title: string }>;
    pricing: PlanPricingModel[];
    features: PlanFeatureTypeModel[];
    subscribers: number;
    createdAt: string;
    lastUpdated: PlanLastUpdatedModel;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.duration = data.duration;
    this.durationType = data.durationType;
    this.price = data.price;
    this.status = data.status;
    this.hasTrial = data.hasTrial;
    this.trialDays = data.trialDays;
    this.highlightBadges = data.highlightBadges;
    this.pricing = data.pricing;
    this.features = data.features;
    this.subscribers = data.subscribers;
    this.createdAt = data.createdAt;
    this.lastUpdated = data.lastUpdated;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    const lastUpdated = (json.last_updated ?? json.lastUpdated) as
      | Record<string, unknown>
      | undefined;

    return new PlanModel({
      id: Number(json.id ?? json.plan_id),
      title: json.title ?? '',
      description: json.description ?? '',
      duration: Number(json.duration ?? 0),
      durationType: Number(json.duration_type ?? json.durationType ?? 0) as PlanDurationTypeEnum,
      price: Number(json.price ?? 0),
      status: Number(json.status ?? json.plan_status ?? 0) as PlanStatusEnum,
      hasTrial: Boolean(json.has_trail ?? json.has_trial),
      trialDays: Number(json.trail_days ?? json.trial_days ?? 0),
      highlightBadges: Array.isArray(json.highlight_badge)
        ? (json.highlight_badge as Array<{ id: number; title: string }>)
        : [],
      pricing: Array.isArray(json.pricing) ? (json.pricing as PlanPricingModel[]) : [],
      features: Array.isArray(json.features)
        ? json.features.map((rawFeature: unknown) => {
            const feature = rawFeature as Record<string, unknown>;
            const rawSubTypes = Array.isArray(feature.feature_sub_type)
              ? feature.feature_sub_type
              : Array.isArray(feature.sub_features)
                ? feature.sub_features
                : [];

            return {
              feature_type: Number(
                feature.feature_type ?? feature.feature_id ?? feature.featureType ?? 0,
              ) as PlanFeatureTypeEnum,
              feature_title: (feature.feature_title ?? feature.featureTitle ?? feature.title) as
                | string
                | undefined,
              status: feature.status === undefined ? true : Boolean(feature.status),
              feature_sub_type: rawSubTypes.map((rawSubType: unknown) => {
                const subType = rawSubType as Record<string, unknown>;
                return {
                  sub_type: Number(
                    subType.sub_type ?? subType.subtype ?? subType.id ?? subType.sub_type_id ?? 0,
                  ) as PlanFeatureSubTypeEnum,
                  status: subType.status === undefined ? true : Boolean(subType.status),
                  ...(subType.limit === undefined ? {} : { limit: Number(subType.limit) }),
                };
              }),
            };
          })
        : [],
      subscribers: Number(json.subscribers ?? json['subscribers:'] ?? 0),
      createdAt: String(json.created_at ?? ''),
      lastUpdated: PlanLastUpdatedModel.fromJson(lastUpdated),
    });
  }

  static readonly example = PlanModel.fromJson({
    id: 1,
    title: 'Premium',
    description: 'Premium plan with advanced reporting features.',
    duration: 1,
    duration_type: PlanDurationTypeEnum.MONTH,
    price: 100,
    status: PlanStatusEnum.ACTIVE,
    has_trial: true,
    trial_days: 7,
    highlight_badge: [{ id: 1, title: 'Popular' }],
    pricing: [{ id: 1, price: 100, duration: 1, duration_type: PlanDurationTypeEnum.MONTH }],
    features: [
      {
        feature_type: PlanFeatureTypeEnum.REPORT,
        feature_title: 'Reports',
        status: true,
        feature_sub_type: [
          {
            sub_type: PlanFeatureSubTypeEnum.MAXIMUM_REPORTS_PER_STUDENT,
            status: true,
            limit: 5,
          },
        ],
      },
    ],
    subscribers: 12,
    created_at: '2024-01-01T00:00:00.000Z',
    lastUpdated: PlanLastUpdatedModel.example,
  });
}
