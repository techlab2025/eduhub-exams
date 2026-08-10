import { describe, expect, it } from 'vitest';
import SubscriptionStatsModel from '../subscription.stats.model';

describe('SubscriptionStatsModel', () => {
  it('maps statistics from the API response', () => {
    expect(
      SubscriptionStatsModel.fromJson({
        total_subscribers: 9,
        active_subscriptions: 5,
        cancelled_subscriptions: 2,
        expired_subscriptions: 2,
      }),
    ).toEqual(
      new SubscriptionStatsModel({
        totalSubscribers: 9,
        activeSubscriptions: 5,
        cancelledSubscriptions: 2,
        expiredSubscriptions: 2,
      }),
    );
  });

  it('defaults missing statistics to zero', () => {
    expect(SubscriptionStatsModel.fromJson({})).toMatchObject({
      totalSubscribers: 0,
      activeSubscriptions: 0,
      cancelledSubscriptions: 0,
      expiredSubscriptions: 0,
    });
  });
});
