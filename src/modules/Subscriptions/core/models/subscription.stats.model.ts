export default class SubscriptionStatsModel {
  public readonly totalSubscribers: number;
  public readonly activeSubscriptions: number;
  public readonly cancelledSubscriptions: number;
  public readonly expiredSubscriptions: number;
  public readonly totalSubscribertions: number;

  constructor(data: {
    totalSubscribers: number;
    activeSubscriptions: number;
    cancelledSubscriptions: number;
    expiredSubscriptions: number;
    totalSubscribertions: number;
  }) {
    this.totalSubscribers = data.totalSubscribers;
    this.activeSubscriptions = data.activeSubscriptions;
    this.cancelledSubscriptions = data.cancelledSubscriptions;
    this.expiredSubscriptions = data.expiredSubscriptions;
    this.totalSubscribertions = data.totalSubscribertions;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): SubscriptionStatsModel {
    return new SubscriptionStatsModel({
      totalSubscribers: Number(json.total_subscribers ?? 0),
      activeSubscriptions: Number(json.active_subscriptions ?? 0),
      cancelledSubscriptions: Number(json.cancelled_subscriptions ?? 0),
      expiredSubscriptions: Number(json.expired_subscriptions ?? 0),
      totalSubscribertions: Number(json.total_subscriptions ?? 0),
    });
  }

  static get exmpale(): SubscriptionStatsModel {
    return new SubscriptionStatsModel({
      totalSubscribers: 589212,
      activeSubscriptions: 500000,
      cancelledSubscriptions: 40000,
      expiredSubscriptions: 19842,
      totalSubscribertions: 589212,
    });
  }
}
