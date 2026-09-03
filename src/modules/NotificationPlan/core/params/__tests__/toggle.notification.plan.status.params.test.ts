import { expect, it } from 'vitest';
import { StatusNotificationPlanEnum } from '../../enums/status.notification.plan.enum';
import ToggleNotificationPlanStatusParams from '../toggle.notification.plan.status.params';

it('maps the notification plan active status', () => {
  expect(
    new ToggleNotificationPlanStatusParams(9, StatusNotificationPlanEnum.inactive).toMap(),
  ).toEqual({
    notification_plan_id: 9,
    status: StatusNotificationPlanEnum.inactive,
  });
});
