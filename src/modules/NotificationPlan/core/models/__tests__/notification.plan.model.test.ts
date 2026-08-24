import { describe, expect, it } from 'vitest';
import NotificationPlanModel from '../notification.plan.model';

describe('NotificationPlanModel', () => {
  it('maps identifiers, status, actions, employees, and hierarchies', () => {
    const model = NotificationPlanModel.fromJson({
      notification_plan_id: 9,
      title: 'Team Leader',
      is_active: 1,
      actions: [{ value: 13, name: 'team_added', label: 'Investigation Team Added' }],
      employees: [{ id: 2, name: 'Employee Two' }],
      hierarchies: [{ id: 5, title: 'Team Leader' }],
    });

    expect(model).toMatchObject({ id: 9, title: 'Team Leader', isActive: true, heirarchy: 1 });
    expect(model.actions[0]?.value).toBe(13);
    expect(model.employees[0]?.title).toBe('Employee Two');
    expect(model.hierarchies[0]?.id).toBe(5);
  });
});
