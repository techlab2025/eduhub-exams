import { expect, it } from 'vitest';
import NotificationPlanController from '../notification.plan.controller';

it('uses a singleton notification plan controller', () => {
  expect(NotificationPlanController.getInstance()).toBe(NotificationPlanController.getInstance());
});
