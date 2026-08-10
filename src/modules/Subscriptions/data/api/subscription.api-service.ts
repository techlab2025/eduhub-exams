import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints, ApiResponse } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { SubscriptionEndpoints } from './subscription.api.endpoints';

export default class SubscriptionApiService extends BaseApiService {
  private static instance: SubscriptionApiService;
  private readonly subscriptionEndpoints = new SubscriptionEndpoints();
  static getInstance() {
    if (!this.instance) this.instance = new SubscriptionApiService();
    return this.instance;
  }
  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.subscriptionEndpoints.index,
      show: this.subscriptionEndpoints.show,
      delete: this.subscriptionEndpoints.delete,
    };
  }
  fetchStats(params: Params): Promise<ApiResponse> {
    return this.customPost(this.subscriptionEndpoints.stats, params);
  }
}
