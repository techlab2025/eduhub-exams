import { describe, expect, it } from 'vitest';
import { SubscriptionStatusEnum } from '../../enums/subscription.status.enum';
import SubscriptionPlanModel from '../subscription.plan.model';

describe('SubscriptionPlanModel', () => {
  it('maps the detailed plan response', () => {
    expect(
      SubscriptionPlanModel.fromJson({
        id: 3,
        title: 'Starter',
        plan_status: '2',
        total_paied: '150 L.E',
        payment_method: 'Visa',
        subscribe_date: '20-6-2026',
        expire_date: '20-7-2026',
      }),
    ).toMatchObject({
      id: 3,
      status: SubscriptionStatusEnum.EXPIRED,
      totalPaid: '150 L.E',
      paymentMethod: 'Visa',
    });
  });
});
