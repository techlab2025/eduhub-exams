import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class PlacementTestEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly index = this.url('fetch_placement_test');
  readonly show = this.url('show_placement_test');
  readonly showStudentProfile = this.url('show_placement_test_student');
}
