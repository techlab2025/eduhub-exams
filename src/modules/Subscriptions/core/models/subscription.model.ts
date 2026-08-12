import {
  SubscriptionStatusEnum,
  type SubscriptionStatusEnum as SubscriptionStatus,
} from '../enums/subscription.status.enum';

export default class SubscriptionModel {
  public readonly id: number;
  public readonly student: { id?: number; name: string; serial?: string };
  public readonly educationType: { id: number; title: string } | null;
  public readonly plan: { id: number; title: string };
  public readonly totalPrice: number;
  public readonly subscriptionDate: string;
  public readonly expireDate: string;
  public readonly status: SubscriptionStatus;

  constructor(
    id: number,
    student: { id?: number; name: string; serial?: string },
    educationType: { id: number; title: string } | null,
    plan: { id: number; title: string },
    totalPrice: number,
    subscriptionDate: string,
    expireDate: string,
    status: SubscriptionStatus,
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

  static fromJson(json: Record<string, unknown>) {
    const user =
      json.user && typeof json.user === 'object'
        ? (json.user as Record<string, unknown>)
        : { name: json.stident_name ?? json.student_name ?? '' };
    const planSource = json.plan ?? json.plane;
    const rawPlan =
      planSource && typeof planSource === 'object' ? (planSource as Record<string, unknown>) : {};
    const plan = {
      id: Number(rawPlan.id ?? 0),
      title: String(rawPlan.title ?? ''),
    };
    const educationTypeSource = json.education_type;
    const educationType =
      educationTypeSource && typeof educationTypeSource === 'object'
        ? {
            id: Number((educationTypeSource as Record<string, unknown>).id),
            title: String((educationTypeSource as Record<string, unknown>).title ?? ''),
          }
        : null;

    return new SubscriptionModel(
      Number(json.id ?? json.subscription_id),
      {
        id: user.id === undefined ? undefined : Number(user.id),
        name: String(user.name ?? ''),
        serial: user.serial === undefined ? undefined : String(user.serial),
      },
      educationType,
      plan,
      Number(json.total_price ?? rawPlan.total_paied ?? 0),
      String(json.subscription_date ?? rawPlan.subscribe_date ?? ''),
      String(json.expire_date ?? rawPlan.expire_date ?? ''),
      String(
        json.status ?? rawPlan.plan_status ?? SubscriptionStatusEnum.ACTIVE,
      ) as SubscriptionStatus,
    );
  }

  static readonly example = SubscriptionModel.fromJson({
    id: 1254,
    stident_name: 'Ahmed Hawam',
    plane: { id: 1, title: 'Starter Plan' },
    total_price: 150,
    subscription_date: '20-6-2026',
    expire_date: '20-7-2026',
    status: SubscriptionStatusEnum.ACTIVE,
  });
}
