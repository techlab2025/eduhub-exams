import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class DeleteReasonsEndpoints extends BaseEndpoints {
  protected readonly prefix = 'organization/';

  readonly index = this.url('fetch_delete_reasones');
  readonly create = this.url('create_delete_reasones');
  readonly edit = this.url('edit_delete_reasones');
  readonly show = this.url('show_delete_reasones');
  readonly delete = this.url('delete_delete_reasones');
}
