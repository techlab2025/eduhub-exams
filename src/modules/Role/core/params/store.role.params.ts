import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class StoreRoleParams implements Params {
  public readonly title: Record<string, string>;
  public readonly permissions: string[];

  
  public static readonly validation = new ClassValidation().setRules({
    title: { required: true },
  });

  constructor(title: Record<string, string>, permissions: string[]) {
    this.title = title;
    this.permissions = permissions;
  }

  toMap(): Record<string, unknown> {
    return {
      translations: {
        display_name: Object.fromEntries(
          Object.entries(this.title).map(([locale, value]) => [locale, value.trim()]),
        ),
      },
      permissions: this.permissions,
    };
  }

  validate() {
    return StoreRoleParams.validation.validate(this);
  }

  validateOrThrow() {
    return StoreRoleParams.validation.validateOrThrow(this);
  }
}
