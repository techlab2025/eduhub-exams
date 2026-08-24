import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class NotificationPlanEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_notification_plans');
  readonly store = this.url('acreate_notification_plan');
  readonly show = this.url('fetch_notification_plan_details');
  readonly update = this.url('update_notification_plan');
  readonly toggleStatus = this.url('change_notification_active_status');
  readonly delete = this.url('delete_notification_plan');
}
