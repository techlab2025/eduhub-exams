import { describe, expect, it } from 'vitest';
import { createAdminPermissions } from '../admin.permissions';
import { PermissionsEnum } from '../../enums/permissions.enum';

describe('createAdminPermissions', () => {
  it('contains the supplied permissions as explicit group actions', () => {
    const codes = createAdminPermissions().flatMap((module) =>
      module.permissions.flatMap((group) => group.permissions.map(({ code }) => code)),
    );
    expect(codes).toContain(PermissionsEnum.ADMIN_CREATE);
    expect(codes).toContain(PermissionsEnum.EMPLOYEE_CHANGE_STATUS);
  });

  it('contains every supplied admin permission group and action', () => {
    const settings = createAdminPermissions().find(({ code }) => code === PermissionsEnum.SETTING);
    const actionCodes = settings?.permissions.flatMap((group) =>
      group.permissions.map(({ code }) => code),
    );

    expect(settings?.permissions).toHaveLength(39);
    expect(actionCodes).toHaveLength(180);
    expect(actionCodes).toContain(PermissionsEnum.ADMIN_FETCH);
    expect(actionCodes).toContain(PermissionsEnum.EMPLOYEE_CHANGE_STATUS);
    expect(actionCodes).toContain(PermissionsEnum.DOCUMENT_INDEX_FETCH_TRANSACTIONS);
    expect(actionCodes).not.toContain(PermissionsEnum.ADMIN_ALL);
  });

  it('returns fresh checkbox state for each form', () => {
    const first = createAdminPermissions();
    const firstPermission = first.at(0)?.permissions.at(0)?.permissions.at(0);
    if (firstPermission) firstPermission.checked = true;
    const freshPermission = createAdminPermissions().at(0)?.permissions.at(0)?.permissions.at(0);
    expect(freshPermission?.checked).toBe(false);
  });
});
