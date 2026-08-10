import { describe, expect, it } from 'vitest';
import { SubscriptionEndpoints } from '../subscription.api.endpoints';
describe('SubscriptionEndpoints', () => {
  it('registers all subscription endpoints', () => {
    const value = new SubscriptionEndpoints();
    expect(value.index).toContain('fetch_subscriptions');
    expect(value.show).toContain('show_subscription_details');
    expect(value.stats).toContain('fetch_subscriptions_statics');
    expect(value.delete).toContain('delete_subscription');
  });
});
