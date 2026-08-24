import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints, ApiResponse } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { NotificationPlanEndpoints } from './notification.plan.api.endpoints';

export default class NotificationPlanApiService extends BaseApiService {
  private static instance: NotificationPlanApiService;
  private readonly notificationPlanEndpoints = new NotificationPlanEndpoints();

  static getInstance(): NotificationPlanApiService {
    if (!this.instance) this.instance = new NotificationPlanApiService();
    return this.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.notificationPlanEndpoints.index,
      create: this.notificationPlanEndpoints.store,
      show: this.notificationPlanEndpoints.show,
      update: this.notificationPlanEndpoints.update,
      delete: this.notificationPlanEndpoints.delete,
    };
  }

  toggleStatus(params: Params): Promise<ApiResponse> {
    return this.customPost(this.notificationPlanEndpoints.toggleStatus, params);
  }
}
