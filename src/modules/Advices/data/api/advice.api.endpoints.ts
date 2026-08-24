import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class AdviceEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_advices');
  readonly store = this.url('store_advice');
  readonly show = this.url('show_advice');
  readonly update = this.url('edit_advice');
  readonly delete = this.url('delete_advice');
}
