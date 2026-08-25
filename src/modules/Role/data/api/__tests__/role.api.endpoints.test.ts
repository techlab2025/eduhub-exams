import { describe, expect, it } from 'vitest';
import { RoleEndpoints } from '../role.api.endpoints';

describe('RoleEndpoints', () => {
  it('provides every role CRUD endpoint', () => {
    const endpoints = new RoleEndpoints();
    expect(endpoints.index).toContain('fetch_roles');
    expect(endpoints.show).toContain('show_role');
    expect(endpoints.store).toContain('store_role');
    expect(endpoints.update).toContain('update_role');
    expect(endpoints.delete).toContain('delete_role');
  });
});
