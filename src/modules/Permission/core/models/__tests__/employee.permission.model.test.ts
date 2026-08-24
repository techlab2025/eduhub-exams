import { describe, expect, it } from 'vitest';
import EmployeePermissionModel from '../employee.permission.model';

describe('EmployeePermissionModel', () => {
  it('maps permission objects from the API', () => {
    const model = EmployeePermissionModel.fromJson({
      employee_id: 7,
      permissions: [{ permission: 'OE01' }, { permission: 'NP03' }],
    });
    expect(model.employeeId).toBe(7);
    expect(model.permissions).toEqual(['OE01', 'NP03']);
  });

  it('maps a direct string list', () => {
    expect(EmployeePermissionModel.fromJson(['OE03']).permissions).toEqual(['OE03']);
  });

  it('starts empty when the employee has no permissions', () => {
    expect(EmployeePermissionModel.fromJson({ permissions: [] }).permissions).toEqual([]);
  });

  it('maps permissions nested under the employee', () => {
    const model = EmployeePermissionModel.fromJson({
      employee: { permissions: [{ permission: 'NP01' }] },
    });
    expect(model.permissions).toEqual(['NP01']);
  });
});
