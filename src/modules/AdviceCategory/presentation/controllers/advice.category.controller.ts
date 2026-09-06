import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type AdviceCategoryModel from '../../core/models/advice.category.model';
import AdviceCategoryRepository from '../../data/repositories/advice.category.repository';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';

export default class AdviceCategoryController extends BaseController<
  AdviceCategoryModel,
  AdviceCategoryModel[]
> {
  private static instance: AdviceCategoryController;

  protected get repository() {
    return AdviceCategoryRepository.getInstance();
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
    if (!this.instance) this.instance = new AdviceCategoryController();
    return this.instance;
  }

  async delete(params: Params, options?: ApiCallOptions, showErrorToast = true) {
    const result = await super.delete(params, options);
    if (showErrorToast && result?.error) {
      dialogManager.toastError(result.error.displayMessage);
    }
    return result;
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
      headers: { 'Accept-Language': '*' },
    });
  }
}
