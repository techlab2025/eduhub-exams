import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class StoreRoleParams implements Params {
  public readonly roleName: string;
  public readonly permissions: string[];
  public static readonly validation = new ClassValidation().setRules({
    roleName: { required: true },
  });

  constructor(roleName: string, permissions: string[]) {
    this.roleName = roleName;
    this.permissions = permissions;
  }

  toMap(): Record<string, unknown> {
    return { role_name: this.roleName.trim(), permissions: this.permissions };
  }

  validate() {
    return StoreRoleParams.validation.validate(this);
  }

  validateOrThrow() {
    return StoreRoleParams.validation.validateOrThrow(this);
  }
}
