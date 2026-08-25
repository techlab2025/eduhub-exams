import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { RoleEndpoints } from './role.api.endpoints';

export default class RoleApiService extends BaseApiService {
  private static instance: RoleApiService;
  private readonly roleEndpoints = new RoleEndpoints();

  static getInstance(): RoleApiService {
    if (!this.instance) this.instance = new RoleApiService();
    return this.instance;
  }

  protected get endpoints(): ApiEndpoints {
    return {
      index: this.roleEndpoints.index,
      show: this.roleEndpoints.show,
      create: this.roleEndpoints.store,
      update: this.roleEndpoints.update,
      delete: this.roleEndpoints.delete,
    };
  }
}
