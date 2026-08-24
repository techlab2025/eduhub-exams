import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type AdviceModel from '../../core/models/advice.model';
import AdviceRepository from '../../data/repositories/advice.repository';

export default class AdviceController extends BaseController<AdviceModel, AdviceModel[]> {
  private static instance: AdviceController;

  protected get repository() {
    return AdviceRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showErrorDialog: false,
      showErrorTosat: true,
      showSuccessTosat: true,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  static getInstance() {
    if (!this.instance) this.instance = new AdviceController();
    return this.instance;
  }

  async create(params: Params, options?: ApiCallOptions) {
    return super.create(params, { ...options, useJson: true });
  }

  async update(params: Params, options?: ApiCallOptions) {
    return super.update(params, { ...options, useJson: true });
  }

  async fetchOne(params: Params, options?: ApiCallOptions) {
    return super.fetchOne(params, {
      ...options,
      headers: { 'Accept-Language': (params as { allLocales?: boolean }).allLocales ? '*' : '*' },
    });
  }

  async fetchList(params?: Params, options?: ApiCallOptions) {
    return super.fetchList(params, options);
  }
}
