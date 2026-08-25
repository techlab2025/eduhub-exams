import { describe, expect, it } from 'vitest';
import RoleModel from '../role.model';

describe('RoleModel', () => {
  it('maps role details and permission objects from the API', () => {
    const role = RoleModel.fromJson({
      role_id: 7,
      role_name: 'Content Manager',
      permissions: [{ permission: 'OE01' }, 'OE03'],
      employees_count: 4,
      created_by: { name: 'Mona Ali' },
      created_at: '2026-08-25T10:00:00Z',
    });

    expect(role).toMatchObject({
      id: 7,
      roleName: 'Content Manager',
      permissions: ['OE01', 'OE03'],
      permissionsCount: 2,
      usersCount: 4,
      createdBy: 'Mona Ali',
    });
    expect(role.toOption()).toMatchObject({ id: 7, title: 'Content Manager' });
  });

  it('uses the API permission count when list rows omit permission details', () => {
    expect(RoleModel.fromJson({ id: 2, role_name: 'Admin', permissions_count: 15 })).toMatchObject({
      permissions: [],
      permissionsCount: 15,
    });
  });
});
