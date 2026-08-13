import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import type { ApiEndpoints, ApiResponse } from '@/base/Data/ApiService/baseApiService';
import { PlanEndpoints } from './plan.api.endpoints';

export default class PlanApiService extends BaseApiService {
  private static instance: PlanApiService;
  private readonly planEndpoints = new PlanEndpoints();
  static getInstance() {
    if (!this.instance) this.instance = new PlanApiService();
    return this.instance;
  }
  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.planEndpoints.index,
      create: this.planEndpoints.store,
      show: this.planEndpoints.show,
      update: this.planEndpoints.update,
      delete: this.planEndpoints.delete,
    };
  }

  toggleStatus(params: Params): Promise<ApiResponse> {
    return this.customPost(this.planEndpoints.toggleStatus, params);
  }

  fetchFeatures(params: Params): Promise<ApiResponse> {
    return this.customPost(this.planEndpoints.features, params);
  }
}
