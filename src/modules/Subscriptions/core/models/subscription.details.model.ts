import SubscriptionEducationTypeModel from './subscription.education-type.model';
import SubscriptionPlanModel from './subscription.plan.model';
import SubscriptionUserModel from './subscription.user.model';

export default class SubscriptionDetailsModel {
  public readonly user: SubscriptionUserModel;
  public readonly educationType: SubscriptionEducationTypeModel;
  public readonly plan: SubscriptionPlanModel;
  constructor(data: Partial<SubscriptionDetailsModel>) {
    this.user = data.user as SubscriptionUserModel;
    this.educationType = data.educationType as SubscriptionEducationTypeModel;
    this.plan = data.plan as SubscriptionPlanModel;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    const user = json.user && typeof json.user === 'object' ? json.user : {};
    const educationType =
      json.education_type && typeof json.education_type === 'object' ? json.education_type : {};
    const plan = json.plan && typeof json.plan === 'object' ? json.plan : {};

    return new SubscriptionDetailsModel({
      user: SubscriptionUserModel.fromJson(user as Record<string, unknown>),
      educationType: SubscriptionEducationTypeModel.fromJson(
        educationType as Record<string, unknown>,
      ),
      plan: SubscriptionPlanModel.fromJson(plan as Record<string, unknown>),
    });
  }

  static readonly example = SubscriptionDetailsModel.fromJson({
    user: { id: 1, name: 'Ahmed Hawam', serial: 'Stu-124' },
    education_type: { id: 1, title: 'International-Primary - Grade 1' },
    plan: {
      id: 1,
      title: 'Starter Plan',
      plan_status: '1',
      total_paied: '150 L.E',
      payment_method: 'Visa',
      subscribe_date: '20-6-2026',
      expire_date: '20-7-2026',
    },
  });
}
