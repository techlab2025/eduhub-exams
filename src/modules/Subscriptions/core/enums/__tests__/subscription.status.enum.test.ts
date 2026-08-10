import { describe, expect, it } from 'vitest';
import { SubscriptionStatusEnum } from '../subscription.status.enum';

describe('SubscriptionStatusEnum', () => {
  it('uses the subscription status API values', () => {
    expect(SubscriptionStatusEnum).toEqual({ ACTIVE: '1', EXPIRED: '2', CANCELLED: '3' });
  });
});
