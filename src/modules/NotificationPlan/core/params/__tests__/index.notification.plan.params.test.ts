import { expect, it } from 'vitest';
import { StatusNotificationPlanEnum } from '../../enums/status.notification.plan.enum';
import IndexNotificationPlanParams from '../index.notification.plan.params';

it('maps every documented list filter with its backend name', () => {
  expect(
    new IndexNotificationPlanParams({
      word: 'alerts',
      with_pagination: 1,
      page: 2,
      per_page: 20,
      status: StatusNotificationPlanEnum.inactive,
      employee_id: 7,
      action: 3,
      feature: 1,
    }).toMap(),
  ).toEqual({
    word: 'alerts',
    with_pagination: 1,
    page: 2,
    per_page: 20,
    status: StatusNotificationPlanEnum.inactive,
    employee_id: 7,
    action: 3,
    feature: 1,
  });
});
