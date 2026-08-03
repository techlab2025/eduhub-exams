import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class PlacementEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly index = this.url('fetch_placement');
  readonly show = this.url('show_placement');
  readonly store = this.url('store_placement');
  readonly update = this.url('update_placement');
  readonly delete = this.url('delete_placement');
}
