import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowRoleParams implements Params {
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
    return ShowRoleParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowRoleParams.validation.validateOrThrow(this);
  }
}
