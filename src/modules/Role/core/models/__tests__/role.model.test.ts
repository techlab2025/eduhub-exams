import { describe, expect, it } from 'vitest';
import RoleModel from '../role.model';

describe('RoleModel', () => {
  it('maps localized role titles for display and editing', () => {
    const role = RoleModel.fromJson({
      id: 3,
      title: [
        { locale: 'en', title: 'Content Manager' },
        { locale: 'ar', title: 'مدير المحتوى' },
      ],
    });

    expect(role.roleName).toBe('Content Manager');
    expect(role.translations).toEqual({ en: 'Content Manager', ar: 'مدير المحتوى' });
  });

  it('maps role titles nested in translations', () => {
    const role = RoleModel.fromJson({
      id: 4,
      translations: { title: { en: 'Reviewer', ar: 'مراجع' } },
    });

    expect(role.roleName).toBe('Reviewer');
    expect(role.translations).toEqual({ en: 'Reviewer', ar: 'مراجع' });
  });

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
