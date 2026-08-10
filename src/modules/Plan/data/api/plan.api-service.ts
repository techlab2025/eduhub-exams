import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
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
}
