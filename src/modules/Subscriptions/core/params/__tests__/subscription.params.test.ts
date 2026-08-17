import { describe, expect, it } from 'vitest';
import { SubscriptionStatusEnum } from '../../enums/subscription.status.enum';
import { IndexSubscriptionParams } from '../index.subscription.params';
import { ShowSubscriptionParams } from '../show.subscription.params';
describe('subscription params', () => {
  it('maps filters and identifiers', () => {
    expect(
      new IndexSubscriptionParams('', 2, 20, {
        educationTypeId: 4,
        planId: 8,
        status: SubscriptionStatusEnum.ACTIVE,
        paidFrom: 100,
        paidTo: 500,
        subscriptionDateFrom: '2026-06-01',
        expireDateTo: '2026-12-31',
      }).toMap(),
    ).toMatchObject({
      page: 2,
      per_page: 20,
      education_type_id: 4,
      plan_id: 8,
      status: 1,
      paied_from: 100,
      paied_to: 500,
      subscription_date_from: '2026-06-01',
      expire_date_to: '2026-12-31',
    });
    expect(new ShowSubscriptionParams(7).toMap()).toEqual({ subscription_id: 7 });
  });
});
