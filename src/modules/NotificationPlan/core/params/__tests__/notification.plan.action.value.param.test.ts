import { expect, expectTypeOf, it } from 'vitest';
import type { NotificationPlanActionValueParam } from '../notification.plan.action.value.param';

it('defines the action request contract', () => {
  const value: NotificationPlanActionValueParam = { action: 4, sub_action: null };
  expect(value).toEqual({ action: 4, sub_action: null });
  expectTypeOf(value.action).toBeNumber();
});
