import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowAdviceCategoryParams implements Params {
  public adviceCategoryId: number;

  public static readonly validation = new ClassValidation().setRules({
    adviceCategoryId: { required: true },
  });

  constructor(data: { adviceCategoryId: number }) {
    this.adviceCategoryId = data.adviceCategoryId;
  }

  toMap(): Record<string, unknown> {
    return { category_id: this.adviceCategoryId };
  }

  validate() {
    return ShowAdviceCategoryParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowAdviceCategoryParams.validation.validateOrThrow(this);
  }
}
