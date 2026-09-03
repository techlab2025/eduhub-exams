import { expect, it } from 'vitest';
import { NotificationPlanEndpoints } from '../notification.plan.api.endpoints';

it('registers all notification plan endpoints', () => {
  const endpoints = new NotificationPlanEndpoints();
  expect([
    endpoints.store,
    endpoints.index,
    endpoints.show,
    endpoints.update,
    endpoints.toggleStatus,
    endpoints.delete,
  ]).toEqual(
    expect.arrayContaining([
      expect.stringContaining('store_notification_plan'),
      expect.stringContaining('fetch_notification_plans'),
      expect.stringContaining('show_notification_plan'),
      expect.stringContaining('edit_notification_plan'),
      expect.stringContaining('change_notification_active_status'),
      expect.stringContaining('delete_notification_plan'),
    ]),
  );
});
