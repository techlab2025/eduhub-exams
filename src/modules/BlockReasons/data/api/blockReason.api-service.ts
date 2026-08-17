import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { BlockReasonEndpoints } from './blockReason.api.endpoints';

export default class BlockReasonApiService extends BaseApiService {
  private static instance: BlockReasonApiService;
  private readonly featureEndpoints = new BlockReasonEndpoints();

  static getInstance() {
    if (!this.instance) this.instance = new BlockReasonApiService();
    return this.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.featureEndpoints.index,
      create: this.featureEndpoints.store,
      show: this.featureEndpoints.show,
      update: this.featureEndpoints.update,
      delete: this.featureEndpoints.delete,
    };
  }
}
