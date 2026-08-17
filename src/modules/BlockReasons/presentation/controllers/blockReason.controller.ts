import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import type BlockReasonModel from '../../core/models/blockReason.model';
import BlockReasonRepository from '../../data/repositories/blockReason.repository';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';

export default class BlockReasonController extends BaseController<
  BlockReasonModel,
  BlockReasonModel[]
> {
  private static instance: BlockReasonController;
  protected get repository() {
    return BlockReasonRepository.getInstance();
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
    if (!this.instance) this.instance = new BlockReasonController();
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
    return super.fetchList(params, { ...options });
  }
  async delete(params: Params, options?: ApiCallOptions) {
    const result = await super.delete(params, options);
    if (result?.error?.title) {
      dialogManager.toastError(result?.error?.title);
    }
    return result;
  }
}
