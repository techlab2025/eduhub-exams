import { describe, expect, it } from 'vitest';
import { SubscriptionStatusEnum } from '../../enums/subscription.status.enum';
import SubscriptionModel from '../subscription.model';
describe('SubscriptionModel', () => {
  it('maps the documented subscription list response', () => {
    const subscription = SubscriptionModel.fromJson({
      id: 1,
      stident_name: 'Mona',
      plane: { id: 2, title: 'Premium' },
      total_price: 250,
      subscription_date: '2026-06-20',
      expire_date: '2026-07-20',
      status: '2',
    });

    expect(subscription).toMatchObject({
      id: 1,
      student: { name: 'Mona' },
      plan: { id: 2, title: 'Premium' },
      totalPrice: 250,
      subscriptionDate: '2026-06-20',
      expireDate: '2026-07-20',
      status: SubscriptionStatusEnum.EXPIRED,
    });
  });

  it('provides a complete example for the subscriptions table', () => {
    expect(SubscriptionModel.example).toMatchObject({
      id: 1254,
      student: { name: 'Ahmed Hawam' },
      plan: { id: 1, title: 'Starter Plan' },
      totalPrice: 150,
      subscriptionDate: '20-6-2026',
      expireDate: '20-7-2026',
      status: SubscriptionStatusEnum.ACTIVE,
    });
  });
});
