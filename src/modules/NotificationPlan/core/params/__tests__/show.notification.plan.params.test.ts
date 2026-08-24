import { expect, it } from 'vitest';
import ShowNotificationPlanParams from '../show.notification.plan.params';

it('maps the show notification plan ID', () => {
  expect(new ShowNotificationPlanParams(9).toMap()).toEqual({ notification_plan_id: 9 });
});
