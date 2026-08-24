import { describe, expect, it } from 'vitest';
import { NotificationPlanActionEnum } from '../notification.plan.action.enum';

describe('NotificationPlanActionEnum', () => {
  it('keeps the project-specific backend action value', () => {
    expect(NotificationPlanActionEnum).toEqual({ COURSE_ASSIGEND: 1 });
  });
});
