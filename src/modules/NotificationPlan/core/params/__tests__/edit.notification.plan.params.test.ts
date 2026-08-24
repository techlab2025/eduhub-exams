import { expect, it } from 'vitest';
import EditNotificationPlanParams from '../edit.notification.plan.params';

it('adds the notification plan ID to the update payload', () => {
  const params = new EditNotificationPlanParams(9, 'Plan', [{ action: 13, sub_action: null }]);
  expect(params.toMap()).toMatchObject({ notification_plan_id: 9, title: 'Plan' });
});
