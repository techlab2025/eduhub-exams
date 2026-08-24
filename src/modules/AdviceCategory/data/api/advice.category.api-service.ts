import BaseApiService, { type ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { AdviceCategoryEndpoints } from './advice.category.api.endpoints';

export default class AdviceCategoryApiService extends BaseApiService {
  private static instance: AdviceCategoryApiService;
  private readonly featureEndpoints = new AdviceCategoryEndpoints();

  static getInstance() {
    if (!this.instance) this.instance = new AdviceCategoryApiService();
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
