import { describe, expect, it } from 'vitest';
import { SubscriptionStatusEnum } from '../../enums/subscription.status.enum';
import SubscriptionModel from '../subscription.model';
describe('SubscriptionModel', () => {
  it('maps subscription responses', () => {
    expect(
      SubscriptionModel.fromJson({
        id: 1,
        stident_name: 'Mona',
        plane: { id: 2, title: 'Premium' },
        status: '2',
      }),
    ).toMatchObject({ student: { name: 'Mona' }, status: SubscriptionStatusEnum.EXPIRED });
  });
});
