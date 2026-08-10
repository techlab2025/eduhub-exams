import { describe, expect, it } from 'vitest';
import SubscriptionModel, { SubscriptionStatusEnum } from '../subscription.model';
describe('SubscriptionModel', () => {
  it('maps list responses and statistics', () => {
    expect(
      SubscriptionModel.fromJson({
        id: 1,
        stident_name: 'Mona',
        plane: { id: 2, title: 'Premium' },
        status: '2',
      }),
    ).toMatchObject({ student: { name: 'Mona' }, status: SubscriptionStatusEnum.EXPIRED });
    expect(
      SubscriptionModel.statsFromJson({ total_subscribers: 9, active_subscriptions: 5 }),
    ).toMatchObject({ totalSubscribers: 9, activeSubscriptions: 5 });
  });
});
