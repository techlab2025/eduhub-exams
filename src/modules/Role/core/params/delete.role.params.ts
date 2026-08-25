import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class DeleteRoleParams implements Params {
  public readonly roleId: number;
  public static readonly validation = new ClassValidation().setRules({
    roleId: { required: true, min: 1 },
  });

  constructor(roleId: number) {
    this.roleId = roleId;
  }

  toMap(): Record<string, number> {
    return { role_id: this.roleId };
  }

  validate() {
    return DeleteRoleParams.validation.validate(this);
  }

  validateOrThrow() {
    return DeleteRoleParams.validation.validateOrThrow(this);
  }
}
