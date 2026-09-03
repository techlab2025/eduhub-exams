import { expect, it } from 'vitest';
import NotificationPlanActionModel from '../notification.plan.action.model';

it('maps a notification plan action', () => {
  expect(
    NotificationPlanActionModel.fromJson({
      action_ids: [1, 2, 4],
      message: 'Updated: Ahmed created a question.',
    }),
  ).toMatchObject({
    action_ids: [1, 2, 4],
    message: 'Updated: Ahmed created a question.',
  });
});
