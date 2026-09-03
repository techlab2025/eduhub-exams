import { describe, expect, it } from 'vitest';
import { StatusNotificationPlanEnum } from '../../enums/status.notification.plan.enum';
import NotificationPlanDetailsModel from '../notification.plan.details.model';

describe('NotificationPlanDetailsModel', () => {
  it('maps the documented show response without renaming its fields', () => {
    const model = NotificationPlanDetailsModel.fromJson({
      id: 9,
      plan_title: 'Question alerts',
      employees: [{ id: 2, name: 'Employee Two' }],
      actions: [{ action_ids: [1, 2], message: 'A question changed.' }],
      status: StatusNotificationPlanEnum.active,
      created_by: 'Portal Admin',
      created_at: '2026-09-02T09:20:42.000000Z',
      updated_by: 'Super Admin',
      updated_at: '2026-09-03T09:20:42.000000Z',
    });

    expect(model).toMatchObject({
      id: 9,
      plan_title: 'Question alerts',
      status: StatusNotificationPlanEnum.active,
      created_by: 'Portal Admin',
      updated_by: 'Super Admin',
    });
    expect(model.employees[0]).toEqual({ id: 2, name: 'Employee Two' });
    expect(model.actions[0]).toMatchObject({
      action_ids: [1, 2],
      message: 'A question changed.',
    });
  });
});
