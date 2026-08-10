import { describe, expect, it } from 'vitest';
import { SubscriptionStatusEnum } from '../../enums/subscription.status.enum';
import { IndexSubscriptionParams, ShowSubscriptionParams } from '../subscription.params';
describe('subscription params', () => {
  it('maps filters and identifiers', () => {
    expect(
      new IndexSubscriptionParams('', 2, 20, {
        educationTypeId: 4,
        status: SubscriptionStatusEnum.ACTIVE,
      }).toMap(),
    ).toMatchObject({ page: 2, per_page: 20, education_type_id: 4, status: '1' });
    expect(new ShowSubscriptionParams(7).toMap()).toEqual({ subscription_id: 7 });
  });
});
