import { expect, it } from 'vitest';
import DeleteNotificationPlanParams from '../delete.notification.plan.params';

it('maps the delete notification plan ID', () => {
  expect(new DeleteNotificationPlanParams(9).toMap()).toEqual({ notification_plan_id: 9 });
});
