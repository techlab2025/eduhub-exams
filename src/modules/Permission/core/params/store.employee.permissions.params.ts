import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { PermissionCode } from '../enums/permissions.enum';

export default class StoreEmployeePermissionsParams implements Params {
  public static readonly validation = new ClassValidation().setRules({
    employeeId: { required: true, min: 1 },
  });

  constructor(
    public employeeId: number,
    public permissions: PermissionCode[],
  ) {}

  toMap(): Record<string, unknown> {
    return { employee_id: this.employeeId, permissions: this.permissions };
  }

  validate() {
    return StoreEmployeePermissionsParams.validation.validate(this);
  }

  validateOrThrow() {
    return StoreEmployeePermissionsParams.validation.validateOrThrow(this);
  }
}
