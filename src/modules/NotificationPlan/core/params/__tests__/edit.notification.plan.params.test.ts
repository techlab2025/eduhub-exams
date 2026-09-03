import { expect, it } from 'vitest';
import { StatusNotificationPlanEnum } from '../../enums/status.notification.plan.enum';
import EditNotificationPlanParams from '../edit.notification.plan.params';

it('adds the notification plan ID to the update payload', () => {
  const params = new EditNotificationPlanParams(
    9,
    'Plan',
    [2],
    [{ action_ids: [1], message: 'A question changed.' }],
    StatusNotificationPlanEnum.inactive,
  );
  expect(params.toMap()).toEqual({
    notification_plan_id: 9,
    plan_title: 'Plan',
    employee_ids: [2],
    action: [{ action_ids: [1], message: 'A question changed.' }],
    status: StatusNotificationPlanEnum.inactive,
  });
});
