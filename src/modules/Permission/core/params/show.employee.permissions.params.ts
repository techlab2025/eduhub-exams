import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowEmployeePermissionsParams implements Params {
  public employeeId: number;

  public static readonly validation = new ClassValidation().setRules({
    employeeId: { required: true, min: 1 },
  });

  constructor(employeeId: number) {
    this.employeeId = employeeId;
  }

  toMap(): Record<string, number> {
    return { employee_id: this.employeeId };
  }

  validate() {
    return ShowEmployeePermissionsParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowEmployeePermissionsParams.validation.validateOrThrow(this);
  }
}
