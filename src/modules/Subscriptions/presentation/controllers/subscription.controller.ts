import { ref } from 'vue';
import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type SubscriptionStatsModel from '../../core/models/subscription.stats.model';
import type SubscriptionModel from '../../core/models/subscription.model';
import SubscriptionRepository from '../../data/repositories/subscription.repository';
import { SubscriptionStatsParams } from '../../core/params/subscription.params';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';

export default class SubscriptionController extends BaseController<
  SubscriptionModel,
  SubscriptionModel[]
> {
  private static instance: SubscriptionController;
  readonly stats = ref<SubscriptionStatsModel | null>(null);

  protected get repository() {
    return SubscriptionRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showErrorDialog: false,
      showSuccessTosat: true,
      showErrorTosat: true,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  static getInstance(): SubscriptionController {
    if (!SubscriptionController.instance) {
      SubscriptionController.instance = new SubscriptionController();
    }
    return SubscriptionController.instance;
  }

  async fetchStats() {
    const result = await this.repository.fetchStats(new SubscriptionStatsParams());
    this.stats.value = result.data;
    return result;
  }
  async fetchList(
    params?: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<SubscriptionModel[]>> {
    return super.fetchList(params, { ...options, useStaticData: true });
  }
}
