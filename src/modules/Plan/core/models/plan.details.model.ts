import { PlanStatusEnum } from '../enums/plan.status.enum';
import PlanActiveLogModel from './plan.active.log.model';
import PlanCreatedByModel from './plan.created.by.model';
import PlanFeatureModel from './plan.feature.model';
import PlanHighlightBadgeModel from './plan.highlight.badge.model';
import PlanPricingModel from './plan.pricing.model';

export default class PlanDetailsModel {
  public readonly id: number;
  public readonly title: string;
  public readonly status: PlanStatusEnum;
  public readonly highlightBadges: PlanHighlightBadgeModel[];
  public readonly createdBy: PlanCreatedByModel;
  public readonly createdAt: string;
  public readonly lastUpdateAt: string;
  public readonly subscribers: number;
  public readonly trialDays: number;
  public readonly pricing: PlanPricingModel[];
  public readonly features: PlanFeatureModel[];
  public readonly activeLog: PlanActiveLogModel[];

  constructor(data: {
    id: number;
    title: string;
    status: PlanStatusEnum;
    highlightBadges: PlanHighlightBadgeModel[];
    createdBy: PlanCreatedByModel;
    createdAt: string;
    lastUpdateAt: string;
    subscribers: number;
    trialDays: number;
    pricing: PlanPricingModel[];
    features: PlanFeatureModel[];
    activeLog: PlanActiveLogModel[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.status = data.status;
    this.highlightBadges = data.highlightBadges;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.lastUpdateAt = data.lastUpdateAt;
    this.subscribers = data.subscribers;
    this.trialDays = data.trialDays;
    this.pricing = data.pricing;
    this.features = data.features;
    this.activeLog = data.activeLog;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    const createdBy = (json.craeted_by ?? json.created_by ?? {}) as Record<string, unknown>;

    return new PlanDetailsModel({
      id: Number(json.id ?? 0),
      title: String(json.title ?? ''),
      status: Number(json.status ?? 0) as PlanStatusEnum,
      highlightBadges: Array.isArray(json.highlight_badge)
        ? json.highlight_badge.map((item) =>
            PlanHighlightBadgeModel.fromJson(item as Record<string, unknown>),
          )
        : [],
      createdBy: PlanCreatedByModel.fromJson(createdBy),
      createdAt: String(json.created_at ?? ''),
      lastUpdateAt: String(json.last_update_at ?? ''),
      subscribers: Number(json['subscribers:'] ?? json.subscribers ?? 0),
      trialDays: Number(json.trail_days ?? 0),
      pricing: Array.isArray(json.pricing)
        ? json.pricing.map((item) => PlanPricingModel.fromJson(item as Record<string, unknown>))
        : [],
      features: Array.isArray(json.features)
        ? json.features.map((item) => PlanFeatureModel.fromJson(item as Record<string, unknown>))
        : [],
      activeLog: Array.isArray(json.active_log)
        ? json.active_log.map((item) =>
            PlanActiveLogModel.fromJson(item as Record<string, unknown>),
          )
        : [],
    });
  }

  static readonly example = PlanDetailsModel.fromJson({
    id: 1,
    title: 'The Complete Plan',
    status: PlanStatusEnum.ACTIVE,
    highlight_badge: [{ id: 1, title: 'Most Popular' }],
    craeted_by: { id: 1, title: 'Ahmed Hawam' },
    created_at: '2026-06-20',
    last_update_at: '2026-07-05',
    'subscribers:': 1245,
    trail_days: 14,
    pricing: [
      { price: 499, duration: 1, duration_type: 3 },
      { price: 4999, duration: 1, duration_type: 4 },
    ],
    features: [
      {
        feature_id: 1,
        feature_title: 'Analytical Reports',
        sub_features: [{ id: 1, status: true }],
      },
    ],
    active_log: [PlanActiveLogModel.example],
  });
}
