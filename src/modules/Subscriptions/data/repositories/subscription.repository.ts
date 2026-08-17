import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';
import SubscriptionModel from '../../core/models/subscription.model';
import SubscriptionStatsModel from '../../core/models/subscription.stats.model';
import SubscriptionDetailsModel from '../../core/models/subscription.details.model';
import SubscriptionApiService from '../api/subscription.api-service';
import { SubscriptionStatusEnum } from '../../core/enums/subscription.status.enum';

export default class SubscriptionRepository extends BaseRepository<
  SubscriptionDetailsModel,
  SubscriptionModel[]
> {
  private static instance: SubscriptionRepository;
  protected get apiService() {
    return SubscriptionApiService.getInstance();
  }
  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }
  protected get mockItem() {
    return SubscriptionDetailsModel.example;
  }
  protected get mockList() {
    return [
      SubscriptionModel.example,
      { ...SubscriptionModel.example, status: SubscriptionStatusEnum.EXPIRED  , },
      { ...SubscriptionModel.example, status: SubscriptionStatusEnum.ACTIVE },
      { ...SubscriptionModel.example, status: SubscriptionStatusEnum.CANCELLED },
    ];
  }
  static getInstance() {
    if (!this.instance) this.instance = new SubscriptionRepository();
    return this.instance;
  }
  protected parseItem(data: unknown) {
    return SubscriptionDetailsModel.fromJson(data as Record<string, unknown>);
  }
  protected parseList(data: unknown) {
    return Array.isArray(data)
      ? data.map((item) => SubscriptionModel.fromJson(item as Record<string, unknown>))
      : [];
  }
  fetchStats(params: Params): Promise<DataState<SubscriptionStatsModel>> {
    return this.executeCustom(
      () => this.apiService.fetchStats(params),
      SubscriptionStatsModel.fromJson,
    );
  }
}
