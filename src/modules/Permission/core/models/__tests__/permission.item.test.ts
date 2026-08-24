import { describe, expect, it } from 'vitest';
import { PermissionsEnum } from '../../enums/permissions.enum';
import type { PermissionActionItem } from '../permission.item';

describe('PermissionActionItem', () => {
  it('describes a selectable permission', () => {
    const item: PermissionActionItem = {
      code: PermissionsEnum.ORG_EMPLOYEE_FETCH,
      labelKey: 'permission.actions.fetch',
      checked: false,
    };
    expect(item.checked).toBe(false);
  });
});
