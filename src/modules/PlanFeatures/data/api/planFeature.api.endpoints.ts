import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class PlanFeatureEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_plan_feature');
  readonly store = this.url('store_plan_feature');
  readonly show = this.url('show_plan_feature');
  readonly update = this.url('edit_plan_feature');
  readonly delete = this.url('delete_plan_feature');
}
