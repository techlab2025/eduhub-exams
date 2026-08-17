import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class BlockReasonEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_block_reasons');
  readonly store = this.url('store_block_reason');
  readonly show = this.url('show_block_reason');
  readonly update = this.url('update_block_reason');
  readonly delete = this.url('delete_block_reason');
}
