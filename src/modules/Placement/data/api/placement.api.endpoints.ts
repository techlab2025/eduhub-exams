import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class PlacementEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly index = this.url('fetch_placement_exam_config');
  readonly show = this.url('fetch_placement_exam_config');
  readonly store = this.url('create_or_update_placement_exam_config');
  readonly update = this.url('create_or_update_placement_exam_config');
  readonly delete = this.url('delete_placement');
}
