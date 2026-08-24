import { describe, expect, it } from 'vitest';
import ShowEmployeePermissionsParams from '../show.employee.permissions.params';

describe('ShowEmployeePermissionsParams', () => {
  it('maps the employee id', () => {
    const params = new ShowEmployeePermissionsParams(4);
    expect(params.toMap()).toEqual({ employee_id: 4 });
    expect(params.validate().isValid).toBe(true);
  });
});
