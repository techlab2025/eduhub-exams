import { expect, it } from 'vitest';
import { StatusNotificationPlanEnum } from '../../enums/status.notification.plan.enum';
import AddNotificationPlanParams from '../add.notification.plan.params';

it('maps the create notification plan payload', () => {
  const params = new AddNotificationPlanParams(
    'Observation',
    [2, 3],
    [{ action_ids: [1, 4], message: 'A question changed.' }],
    StatusNotificationPlanEnum.active,
  );
  expect(params.toMap()).toEqual({
    plan_title: 'Observation',
    employee_ids: [2, 3],
    action: [{ action_ids: [1, 4], message: 'A question changed.' }],
    status: StatusNotificationPlanEnum.active,
  });
});
