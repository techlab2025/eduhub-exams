import { expect, it } from 'vitest';
import NotificationPlanActionModel from '../notification.plan.action.model';

it('maps a notification plan action', () => {
  expect(
    NotificationPlanActionModel.fromJson({
      value: 4,
      name: 'observation_created',
      label: 'Observation Created',
      sub_action: 2,
    }),
  ).toMatchObject({ value: 4, label: 'Observation Created', subAction: 2 });
});
