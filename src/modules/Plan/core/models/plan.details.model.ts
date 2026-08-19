import { PlanStatusEnum } from '../enums/plan.status.enum';
import PlanActiveLogModel from './plan.active.log.model';
import PlanCreatedByModel from './plan.created.by.model';
import PlanFeatureModel from './plan.feature.model';
import PlanHighlightBadgeModel from './plan.highlight.badge.model';
import PlanPricingModel from './plan.pricing.model';
import PlanLastUpdatedModel from './plan.last.upadated.model';

export default class PlanDetailsModel {
  public readonly id: number;
  public readonly title: string;
  public readonly status: PlanStatusEnum;
  public readonly highlightBadges: PlanHighlightBadgeModel[];
  public readonly createdBy: PlanCreatedByModel;
  public readonly createdAt: string;
  public readonly lastUpdated: PlanLastUpdatedModel;
  public readonly subscribers: number;
  public readonly trialDays: number;
  public readonly pricing: PlanPricingModel[];
  public readonly features: PlanFeatureModel[];
  public readonly activeLog: PlanActiveLogModel[];
  public readonly titles: Record<string, string>[];
  public readonly descriptions: Record<string, string>[];
  public readonly numberOfSubjects: number;

  constructor(data: {
    id: number;
    title: string;
    status: PlanStatusEnum;
    highlightBadges: PlanHighlightBadgeModel[];
    createdBy: PlanCreatedByModel;
    createdAt: string;
    lastUpdated: PlanLastUpdatedModel;
    subscribers: number;
    trialDays: number;
    pricing: PlanPricingModel[];
    features: PlanFeatureModel[];
    activeLog: PlanActiveLogModel[];
    titles: Record<string, string>[];
    descriptions: Record<string, string>[];
    numberOfSubjects: number;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.status = data.status;
    this.highlightBadges = data.highlightBadges;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.lastUpdated = data.lastUpdated;
    this.subscribers = data.subscribers;
    this.trialDays = data.trialDays;
    this.pricing = data.pricing;
    this.features = data.features;
    this.activeLog = data.activeLog;
    this.titles = data.titles;
    this.descriptions = data.descriptions;
    this.numberOfSubjects = data.numberOfSubjects;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    const createdBy = (json.created_by ?? json.craeted_by ?? {}) as Record<string, unknown>;
    const lastUpdated = (json.last_updated ?? {
      last_updated_date: json.last_update_at,
    }) as Record<string, unknown>;

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
      lastUpdated: PlanLastUpdatedModel.fromJson(lastUpdated),
      subscribers: Number(json['subscribers'] ?? json['subscribers:'] ?? 0),
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
      titles: json.title as Record<string, string>[],
      descriptions: json.description as Record<string, string>[],
      numberOfSubjects: Number(json.number_of_subjects ?? json.numberOfSubjects ?? 0),
    });
  }

  static readonly example = PlanDetailsModel.fromJson({
    id: 1,
    title: 'The Complete Plan',
    status: PlanStatusEnum.ACTIVE,
    highlight_badge: [{ id: 1, title: 'Most Popular' }],
    craeted_by: { id: 1, title: 'Ahmed Hawam' },
    created_at: '2026-06-20',
    last_updated: {
      last_updated_date: '2026-07-05',
      last_updated_person: { id: 1, name: 'Admin EG' },
    },
    'subscribers:': 1245,
    trail_days: 14,
    number_of_subjects: 8,
    pricing: [
      { price: 499, duration: 1, duration_type: 3 },
      { price: 4999, duration: 1, duration_type: 4 },
    ],
    features: [
      {
        feature_id: 1,
        feature_title: 'Analytical Reports',
        sub_features: [
          { id: 1, status: true, limit: 0 },
          { id: 2, status: true, limit: 0 },
          { id: 3, status: true, limit: 0 },
          { id: 4, status: true, limit: 0 },
        ],
      },
      {
        feature_id: 3,
        feature_title: 'Study Plan',
        sub_features: [
          { id: 11, status: true, limit: 0 },
          { id: 12, status: true, limit: 0 },
          { id: 13, status: true, limit: 1 },
        ],
      },
      {
        feature_id: 5,
        feature_title: 'Practice',
        sub_features: [
          { id: 16, status: true, limit: 0 },
          { id: 17, status: true, limit: 0 },
          { id: 18, status: true, limit: 0 },
          { id: 19, status: true, limit: 30 },
        ],
      },
      {
        feature_id: 6,
        feature_title: 'Placement Test',
        sub_features: [
          { id: 1, status: true, limit: 0 },
          { id: 2, status: true, limit: 0 },
          { id: 3, status: true, limit: 0 },
        ],
      },
      {
        feature_id: 4,
        feature_title: 'What Did You Study',
        sub_features: [
          { id: 14, status: true, limit: 0 },
          { id: 15, status: true, limit: 20 },
        ],
      },
      {
        feature_id: 2,
        feature_title: 'Progress Tracking',
        sub_features: [
          { id: 7, status: true, limit: 0 },
          { id: 8, status: true, limit: 0 },
        ],
      },
    ],
    active_log: [PlanActiveLogModel.example],
  });
}
