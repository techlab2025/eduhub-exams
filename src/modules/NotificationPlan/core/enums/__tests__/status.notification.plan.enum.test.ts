import { describe, expect, it } from 'vitest';
import { StatusNotificationPlanEnum } from '../status.notification.plan.enum';

describe('StatusNotificationPlanEnum', () => {
  it('uses the documented backend values and names', () => {
    expect(StatusNotificationPlanEnum.inactive).toBe('0');
    expect(StatusNotificationPlanEnum.active).toBe('1');
  });
});
