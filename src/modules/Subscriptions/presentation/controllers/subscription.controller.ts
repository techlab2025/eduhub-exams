import { ref } from 'vue';
import BaseController from '@/base/Presentation/Controller/baseController';
import type { SubscriptionStats } from '../../core/models/subscription.model';
import type SubscriptionModel from '../../core/models/subscription.model';
import SubscriptionRepository from '../../data/repositories/subscription.repository';
import { SubscriptionStatsParams } from '../../core/params/subscription.params';

export default class SubscriptionController extends BaseController<
  SubscriptionModel,
  SubscriptionModel[]
> {
  private static instance: SubscriptionController;
  readonly stats = ref<SubscriptionStats | null>(null);
  protected get repository() {
    return SubscriptionRepository.getInstance();
  }
  static getInstance() {
    if (!this.instance) this.instance = new SubscriptionController();
    return this.instance;
  }
  async fetchStats() {
    const result = await this.repository.fetchStats(new SubscriptionStatsParams());
    this.stats.value = result.data;
    return result;
  }
}
