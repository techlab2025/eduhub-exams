import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class NotificationPlanEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_notification_plans');
  readonly store = this.url('store_notification_plan');
  readonly show = this.url('show_notification_plan');
  readonly update = this.url('edit_notification_plan');
  readonly toggleStatus = this.url('change_notification_active_status');
  readonly delete = this.url('delete_notification_plan');
}
