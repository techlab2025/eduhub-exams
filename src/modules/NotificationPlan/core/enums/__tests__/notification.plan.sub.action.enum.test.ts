import { expect, it } from 'vitest';
import { NotificationPlanSubActionEnum } from '../notification.plan.sub.action.enum';

it('keeps the backend sub-action values', () => {
  expect(Object.values(NotificationPlanSubActionEnum)).toEqual([1, 2, 3, 4]);
});
