import { describe, expect, it } from 'vitest';
import { PermissionsEnum } from '../../enums/permissions.enum';
import StoreEmployeePermissionsParams from '../store.employee.permissions.params';

describe('StoreEmployeePermissionsParams', () => {
  it('maps employee permissions to the API contract', () => {
    const params = new StoreEmployeePermissionsParams(4, [PermissionsEnum.ORG_EMPLOYEE_FETCH]);
    expect(params.toMap()).toEqual({ employee_id: 4, permissions: ['OE01'] });
  });
});
