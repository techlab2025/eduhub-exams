import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { PermissionEndpoints } from './permission.api.endpoints';

export default class PermissionApiService extends BaseApiService {
  private static instance: PermissionApiService;
  private readonly permissionEndpoints = new PermissionEndpoints();

  static getInstance(): PermissionApiService {
    if (!this.instance) this.instance = new PermissionApiService();
    return this.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      show: this.permissionEndpoints.showEmployeePermissions,
      create: this.permissionEndpoints.storeEmployeePermissions,
    };
  }
}
