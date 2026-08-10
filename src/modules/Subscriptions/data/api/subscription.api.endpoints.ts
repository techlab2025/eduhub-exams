import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class SubscriptionEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_subscriptions');
  readonly show = this.url('show_subscription_details');
  readonly stats = this.url('fetch_subscriptions_statics');
  readonly delete = this.url('delete_subscription');
}
