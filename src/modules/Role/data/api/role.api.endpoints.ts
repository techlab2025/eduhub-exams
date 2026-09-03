import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class RoleEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly index = this.url('fetch_roles');
  readonly show = this.url('show_role');
  readonly store = this.url('store_role');
  readonly update = this.url('edit_role');
  readonly delete = this.url('delete_role');
}
