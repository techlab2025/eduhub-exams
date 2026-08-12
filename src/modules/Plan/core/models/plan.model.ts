import { PlanDurationTypeEnum } from '../enums/plan.duration.enum';
import { PlanStatusEnum } from '../enums/plan.status.enum';
import PlanLastUpdatedModel from './plan.last.upadated.model';

export default class PlanModel {
  public readonly id: number;
  public readonly title: string;
  public readonly duration: number;
  public readonly durationType: PlanDurationTypeEnum;
  public readonly price: number;
  public readonly status: PlanStatusEnum;
  public readonly trialDays: number;
  public readonly lastUpdated: PlanLastUpdatedModel;
  public readonly subscribers: number;

  constructor(data: {
    id: number;
    title: string;
    duration: number;
    durationType: PlanDurationTypeEnum;
    price: number;
    status: PlanStatusEnum;
    trialDays: number;
    lastUpdated: PlanLastUpdatedModel;
    subscribers: number;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.duration = data.duration;
    this.durationType = data.durationType;
    this.price = data.price;
    this.status = data.status;
    this.trialDays = data.trialDays;
    this.lastUpdated = data.lastUpdated;
    this.subscribers = data.subscribers;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    const lastUpdated = (json.last_updated ?? json.lastUpdated) as
      | Record<string, unknown>
      | undefined;

    return new PlanModel({
      id: Number(json.id ?? json.plan_id ?? 0),
      title: String(json.title ?? ''),
      duration: Number(json.duration ?? 0),
      durationType: Number(json.duration_type ?? json.durationType ?? 0) as PlanDurationTypeEnum,
      price: Number(json.price ?? 0),
      status: Number(json.status ?? json.plan_status ?? 0) as PlanStatusEnum,
      trialDays: Number(json.trail_days ?? json.trial_days ?? 0),
      lastUpdated: PlanLastUpdatedModel.fromJson(lastUpdated),
      subscribers: Number(json.subscribers ?? 0),
    });
  }

  static readonly example = PlanModel.fromJson({
    id: 1,
    title: 'The Complete Plan',
    duration: 1,
    duration_type: PlanDurationTypeEnum.MONTH,
    price: 499,
    status: PlanStatusEnum.ACTIVE,
    trail_days: 14,
    last_updated: PlanLastUpdatedModel.example,
    subscribers: 10,
  });
}
