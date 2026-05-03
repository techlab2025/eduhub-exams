import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class SupportContactsEndpoints extends BaseEndpoints {
  protected readonly prefix = 'organization/';

  readonly index = this.url('index_support_contacts');
  readonly show = this.url('show_support_contacts');
  readonly store = this.url('store_support_contacts');
  readonly update = this.url('update_support_contacts');
  readonly delete = this.url('delete_support_contacts');
}
