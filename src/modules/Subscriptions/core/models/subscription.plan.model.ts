import {
  SubscriptionStatusEnum,
  type SubscriptionStatusEnum as SubscriptionStatus,
} from '../enums/subscription.status.enum';

export default class SubscriptionPlanModel {
  public readonly id: number;
  public readonly title: string;
  public readonly status: SubscriptionStatus;
  public readonly totalPaid: string;
  public readonly paymentMethod: string;
  public readonly subscribeDate: string;
  public readonly expireDate: string;

  constructor(
    id: number,
    title: string,
    status: SubscriptionStatus,
    totalPaid: string,
    paymentMethod: string,
    subscribeDate: string,
    expireDate: string,
  ) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.totalPaid = totalPaid;
    this.paymentMethod = paymentMethod;
    this.subscribeDate = subscribeDate;
    this.expireDate = expireDate;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new SubscriptionPlanModel(
      Number(json.id ?? 0),
      String(json.title ?? ''),
      String(json.plan_status ?? SubscriptionStatusEnum.ACTIVE) as SubscriptionStatus,
      String(json.total_paied ?? ''),
      String(json.payment_method ?? ''),
      String(json.subscribe_date ?? ''),
      String(json.expire_date ?? ''),
    );
  }
}
