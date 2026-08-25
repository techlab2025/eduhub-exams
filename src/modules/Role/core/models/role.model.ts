import TitleInterface from '@/base/Data/Models/titleInterface';

const permissionCode = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  const record = value as Record<string, unknown>;
  return String(record.permission ?? record.code ?? record.name ?? '');
};

export default class RoleModel {
  public readonly id: number;
  public readonly roleName: string;
  public readonly permissions: string[];
  public readonly permissionsCount: number;
  public readonly usersCount: number;
  public readonly createdBy: string;
  public readonly createdAt: string;

  constructor(data: {
    id: number;
    roleName: string;
    permissions?: string[];
    permissionsCount?: number;
    usersCount?: number;
    createdBy?: string;
    createdAt?: string;
  }) {
    this.id = data.id;
    this.roleName = data.roleName;
    this.permissions = data.permissions ?? [];
    this.permissionsCount = data.permissionsCount ?? this.permissions.length;
    this.usersCount = data.usersCount ?? 0;
    this.createdBy = data.createdBy ?? '';
    this.createdAt = data.createdAt ?? '';
    Object.freeze(this.permissions);
    Object.freeze(this);
  }

  toOption(): TitleInterface<number> {
    return new TitleInterface({ id: this.id, title: this.roleName });
  }

  static fromJson(data: unknown): RoleModel {
    const record = (data ?? {}) as Record<string, unknown>;
    const creator = (record.created_by ?? record.creator ?? {}) as Record<string, unknown>;
    const rawPermissions = Array.isArray(record.permissions)
      ? record.permissions
      : Array.isArray(record.permission)
        ? record.permission
        : [];

    return new RoleModel({
      id: Number(record.id ?? record.role_id ?? 0),
      roleName: String(record.role_name ?? record.name ?? record.title ?? ''),
      permissions: rawPermissions.map(permissionCode).filter(Boolean),
      permissionsCount: Number(
        record.permissions_count ?? record.permission_count ?? rawPermissions.length,
      ),
      usersCount: Number(
        record.users_count ?? record.employee_count ?? record.employees_count ?? 0,
      ),
      createdBy: String(
        record.created_by_name ?? creator.name ?? creator.full_name ?? record.created_by ?? '',
      ),
      createdAt: String(record.created_at ?? record.createdAt ?? ''),
    });
  }

  static get example(): RoleModel {
    return new RoleModel({ id: 1, roleName: 'Content Manager', permissions: ['OE01'] });
  }
}
