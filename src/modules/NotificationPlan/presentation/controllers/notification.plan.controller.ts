import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type NotificationPlanModel from '../../core/models/notification.plan.model';
import NotificationPlanRepository from '../../data/repositories/notification.plan.repository';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

export default class NotificationPlanController extends BaseController<
  NotificationPlanModel,
  NotificationPlanModel[]
> {
  private static instance: NotificationPlanController;

  protected get repository() {
    return NotificationPlanRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showErrorDialog: false,
      showSuccessTosat: true,
      showErrorTosat: true,
      autoRetry: false,
    };
  }

  static getInstance(): NotificationPlanController {
    if (!this.instance) this.instance = new NotificationPlanController();
    return this.instance;
  }

  fetchList(
    params?: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<NotificationPlanModel[]>> {
    return super.fetchList(params, { ...options, useStaticData: true });
  }

  create(params: Params, options?: ApiCallOptions) {
    return super.create(params, { ...options, useJson: true });
  }

  update(params: Params, options?: ApiCallOptions) {
    return super.update(params, { ...options, useJson: true });
  }

  toggleStatus(params: Params) {
    return this.repository.toggleStatus(params);
  }
}
