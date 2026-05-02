import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class AboutEndpoints extends BaseEndpoints {
  protected readonly prefix = 'organization/';

  readonly index =   this.url('fetch_about');
  readonly show =    this.url('show_about');
  readonly store =   this.url('store_about');
  readonly update =  this.url('update_about');
  readonly delete =  this.url('delete_about');
}
