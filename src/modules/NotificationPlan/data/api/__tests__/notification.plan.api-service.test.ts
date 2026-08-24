import { expect, it } from 'vitest';
import NotificationPlanApiService from '../notification.plan.api-service';

it('uses a singleton notification plan API service', () => {
  expect(NotificationPlanApiService.getInstance()).toBe(NotificationPlanApiService.getInstance());
});
