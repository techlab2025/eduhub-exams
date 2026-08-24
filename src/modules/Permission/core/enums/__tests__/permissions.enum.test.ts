import { describe, expect, it } from 'vitest';
import { PermissionsEnum } from '../permissions.enum';

describe('PermissionsEnum', () => {
  it('uses the backend permission codes', () => {
    expect(PermissionsEnum.ORG_EMPLOYEE_UPDATE).toBe('OE04');
    expect(PermissionsEnum.NOTIFICATION_PLAN_DELETE).toBe('NP05');
  });
});
