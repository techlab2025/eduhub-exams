import { expect, it } from 'vitest';
import AddNotificationPlanParams from '../add.notification.plan.params';

it('maps the create notification plan payload', () => {
  const params = new AddNotificationPlanParams(
    'Observation',
    [{ action: 4, sub_action: 4 }],
    [2, 3],
    [],
    true,
    0,
  );
  expect(params.toMap()).toEqual({
    title: 'Observation',
    action_values: [{ action: 4, sub_action: 4 }],
    heirarchy: 0,
    is_active: true,
    employee_ids: [2, 3],
  });
});
