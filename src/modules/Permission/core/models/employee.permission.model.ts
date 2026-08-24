export default class EmployeePermissionModel {
  constructor(
    public employeeId: number,
    public permissions: string[],
  ) {}

  static fromJson(data: unknown): EmployeePermissionModel {
    const record = (data ?? {}) as Record<string, unknown>;
    const rawPermissions = Array.isArray(data)
      ? data
      : Array.isArray(record.permissions)
        ? record.permissions
        : [];
    const permissions = rawPermissions
      .map((item) =>
        typeof item === 'string'
          ? item
          : String((item as { permission?: string })?.permission ?? ''),
      )
      .filter(Boolean);

    return new EmployeePermissionModel(
      Number(record.employee_id ?? record.employeeId ?? 0),
      permissions,
    );
  }

  static get example(): EmployeePermissionModel {
    return new EmployeePermissionModel(1, []);
  }
}
