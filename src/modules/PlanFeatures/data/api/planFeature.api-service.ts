import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { PlanFeatureEndpoints } from './planFeature.api.endpoints';

export default class PlanFeatureApiService extends BaseApiService {
  private static instance: PlanFeatureApiService;
  private readonly featureEndpoints = new PlanFeatureEndpoints();
  static getInstance() {
    if (!this.instance) this.instance = new PlanFeatureApiService();
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
