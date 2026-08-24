import { expect, it } from 'vitest';
import NotificationPlanRepository from '../notification.plan.repository';

it('uses a singleton notification plan repository', () => {
  expect(NotificationPlanRepository.getInstance()).toBe(NotificationPlanRepository.getInstance());
});
