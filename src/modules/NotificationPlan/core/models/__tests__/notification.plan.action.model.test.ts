import { expect, it } from 'vitest';
import NotificationPlanActionModel from '../notification.plan.action.model';

it('maps a notification plan action', () => {
  expect(
    NotificationPlanActionModel.fromJson({
      value: 4,
      name: 'observation_created',
      label: 'Observation Created',
      sub_action: 2,
      displayed_message: 'Updated: Ahmed created an observation.',
      executor_user_name: 'Ahmed Hawam',
      feature_name: 'Questions',
    }),
  ).toMatchObject({
    value: 4,
    label: 'Observation Created',
    subAction: 2,
    displayedMessage: 'Updated: Ahmed created an observation.',
    executorName: 'Ahmed Hawam',
    featureName: 'Questions',
  });
});
