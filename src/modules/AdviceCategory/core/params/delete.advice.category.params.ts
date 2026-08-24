import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class DeleteAdviceCategoryParams implements Params {
  public adviceCategoryId: number;

  public static readonly validation = new ClassValidation().setRules({
    adviceCategoryId: { required: true },
  });

  constructor(data: { adviceCategoryId: number }) {
    this.adviceCategoryId = data.adviceCategoryId;
  }

  toMap(): Record<string, unknown> {
    return { advice_category_id: this.adviceCategoryId };
  }

  validate() {
    return DeleteAdviceCategoryParams.validation.validate(this);
  }

  validateOrThrow() {
    return DeleteAdviceCategoryParams.validation.validateOrThrow(this);
  }
}
