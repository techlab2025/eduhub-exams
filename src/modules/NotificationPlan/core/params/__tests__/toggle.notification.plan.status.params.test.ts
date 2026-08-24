import { expect, it } from 'vitest';
import ToggleNotificationPlanStatusParams from '../toggle.notification.plan.status.params';

it('maps the notification plan active status', () => {
  expect(new ToggleNotificationPlanStatusParams(9, false).toMap()).toEqual({
    notification_plan_id: 9,
    is_active: false,
  });
});
