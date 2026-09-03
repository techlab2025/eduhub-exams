import { describe, expect, it } from 'vitest';
import { StatusNotificationPlanEnum } from '../../enums/status.notification.plan.enum';
import NotificationPlanModel from '../notification.plan.model';

describe('NotificationPlanModel', () => {
  it('maps the documented fetch response without renaming its fields', () => {
    const model = NotificationPlanModel.fromJson({
      id: 9,
      title: 'Team Leader',
      recipients_number: 12,
      actions_number: 4,
      status: StatusNotificationPlanEnum.active,
      created_by: 'Portal Admin',
      created_at: '2026-09-02T09:20:42.000000Z',
    });

    expect(model).toMatchObject({
      id: 9,
      title: 'Team Leader',
      recipients_number: 12,
      actions_number: 4,
      status: StatusNotificationPlanEnum.active,
      created_by: 'Portal Admin',
      created_at: '2026-09-02T09:20:42.000000Z',
    });
  });
});
