import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class CountryEndpoints extends BaseEndpoints {
  protected readonly prefix = 'general/';

  readonly index = this.url('fetch_countries');
  readonly show = this.url('show_country');
  readonly store = this.url('store_country');
  readonly update = this.url('update_country');
  readonly delete = this.url('delete_country');
}
