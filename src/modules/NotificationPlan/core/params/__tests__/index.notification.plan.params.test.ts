import { expect, it } from 'vitest';
import IndexNotificationPlanParams from '../index.notification.plan.params';

it('maps list pagination and status', () => {
  expect(new IndexNotificationPlanParams('', 2, 20, false).toMap()).toMatchObject({
    page: 2,
    per_page: 20,
    is_active: false,
  });
});
