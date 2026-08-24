import BaseApiService, { type ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { AdviceEndpoints } from './advice.api.endpoints';

export default class AdviceApiService extends BaseApiService {
  private static instance: AdviceApiService;
  private readonly featureEndpoints = new AdviceEndpoints();

  static getInstance() {
    if (!this.instance) this.instance = new AdviceApiService();
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
