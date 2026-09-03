import { expect, expectTypeOf, it } from 'vitest';
import type { NotificationPlanActionValueParam } from '../notification.plan.action.value.param';

it('defines the action request contract', () => {
  const value: NotificationPlanActionValueParam = {
    action_ids: [1, 4],
    message: 'A question changed.',
  };
  expect(value).toEqual({ action_ids: [1, 4], message: 'A question changed.' });
  expectTypeOf(value.action_ids).toEqualTypeOf<number[]>();
});
