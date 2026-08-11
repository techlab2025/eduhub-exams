import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class PlanEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_plans');
  readonly store = this.url('store_plan');
  readonly show = this.url('show_plan');
  readonly update = this.url('update_plan');
  readonly toggleStatus = this.url('toggle_plan_status');
  readonly delete = this.url('delete_plan');
}
