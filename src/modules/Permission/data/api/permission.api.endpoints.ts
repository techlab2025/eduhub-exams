import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class PermissionEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly showEmployeePermissions = this.url('fetch_employee_permissions');
  readonly storeEmployeePermissions = this.url('store_employee_permissions');
}
