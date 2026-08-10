export const SubscriptionStatusEnum = { ACTIVE: '1', EXPIRED: '2', CANCELLED: '3' } as const;
export type SubscriptionStatusEnum =
  (typeof SubscriptionStatusEnum)[keyof typeof SubscriptionStatusEnum];

export interface SubscriptionStats {
  totalSubscribers: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
}

export default class SubscriptionModel {
  public readonly id: number;
  public readonly student: { id?: number; name: string; serial?: string };
  public readonly educationType: { id: number; title: string } | null;
  public readonly plan: Record<string, any>;
  public readonly totalPrice: number;
  public readonly subscriptionDate: string;
  public readonly expireDate: string;
  public readonly status: SubscriptionStatusEnum;

  constructor(
    id: number,
    student: { id?: number; name: string; serial?: string },
    educationType: { id: number; title: string } | null,
    plan: Record<string, any>,
    totalPrice: number,
    subscriptionDate: string,
    expireDate: string,
    status: SubscriptionStatusEnum,
  ) {
    this.id = id;
    this.student = student;
    this.educationType = educationType;
    this.plan = plan;
    this.totalPrice = totalPrice;
    this.subscriptionDate = subscriptionDate;
    this.expireDate = expireDate;
    this.status = status;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>) {
    const user = json.user ?? { name: json.stident_name ?? json.student_name ?? '' };
    const plan = json.plan ?? json.plane ?? {};
    return new SubscriptionModel(
      Number(json.id ?? json.subscription_id),
      { id: user.id, name: String(user.name ?? ''), serial: user.serial },
      json.education_type ?? null,
      plan,
      Number(json.total_price ?? plan.total_paied ?? 0),
      String(json.subscription_date ?? plan.subscribe_date ?? ''),
      String(json.expire_date ?? plan.expire_date ?? ''),
      String(
        json.status ?? plan.plan_status ?? SubscriptionStatusEnum.ACTIVE,
      ) as SubscriptionStatusEnum,
    );
  }

  static statsFromJson(json: Record<string, unknown>): SubscriptionStats {
    return {
      totalSubscribers: Number(json.total_subscribers ?? 0),
      activeSubscriptions: Number(json.active_subscriptions ?? 0),
      cancelledSubscriptions: Number(json.cancelled_subscriptions ?? 0),
      expiredSubscriptions: Number(json.expired_subscriptions ?? 0),
    };
  }

  static readonly example = SubscriptionModel.fromJson({ id: 1, stident_name: 'Student' });
}
