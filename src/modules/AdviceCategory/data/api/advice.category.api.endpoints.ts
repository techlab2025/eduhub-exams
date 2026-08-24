import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class AdviceCategoryEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_advice_categories');
  readonly store = this.url('store_advice_category');
  readonly show = this.url('show_advice_category');
  readonly update = this.url('edit_advice_category');
  readonly delete = this.url('delete_advice_category');
}
