import { describe, expect, it } from 'vitest';
import { PermissionEndpoints } from '../permission.api.endpoints';

describe('PermissionEndpoints', () => {
  it('exposes employee permission endpoints', () => {
    const endpoints = new PermissionEndpoints();
    expect(endpoints.showEmployeePermissions).toContain('dashboard/fetch_employee_permissions');
    expect(endpoints.storeEmployeePermissions).toContain('dashboard/store_employee_permissions');
  });
});
