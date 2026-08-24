export default class EmployeePermissionModel {
  public employeeId: number;
  public permissions: string[];

  constructor(employeeId: number, permissions: string[]) {
    this.employeeId = employeeId;
    this.permissions = permissions;
  }

  static fromJson(data: unknown): EmployeePermissionModel {
    const record = (data ?? {}) as Record<string, unknown>;
    const nestedEmployee = (record.employee ?? {}) as Record<string, unknown>;
    const rawPermissions = Array.isArray(data)
      ? data
      : Array.isArray(record.permissions)
        ? record.permissions
        : Array.isArray(record.permission)
          ? record.permission
          : Array.isArray(nestedEmployee.permissions)
            ? nestedEmployee.permissions
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
