import { describe, expect, it } from 'vitest';
import { createAdminPermissions } from '../admin.permissions';
import { PermissionsEnum } from '../../enums/permissions.enum';

describe('createAdminPermissions', () => {
  it('contains employee and notification plan permissions', () => {
    const codes = createAdminPermissions().flatMap((module) =>
      module.permissions.flatMap((group) => group.permissions.map(({ code }) => code)),
    );
    expect(codes).toContain(PermissionsEnum.ORG_EMPLOYEE_CREATE);
    expect(codes).toContain(PermissionsEnum.NOTIFICATION_PLAN_FETCH);
  });

  it('returns fresh checkbox state for each form', () => {
    const first = createAdminPermissions();
    const firstPermission = first.at(0)?.permissions.at(0)?.permissions.at(0);
    if (firstPermission) firstPermission.checked = true;
    const freshPermission = createAdminPermissions().at(0)?.permissions.at(0)?.permissions.at(0);
    expect(freshPermission?.checked).toBe(false);
  });
});
