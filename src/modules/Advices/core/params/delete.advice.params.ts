import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class DeleteAdviceParams implements Params {
  public adviceId: number;

  public static readonly validation = new ClassValidation().setRules({
    adviceId: { required: true },
  });

  constructor(data: { adviceId: number }) {
    this.adviceId = data.adviceId;
  }

  toMap(): Record<string, unknown> {
    return { advice_id: this.adviceId };
  }

  validate() {
    return DeleteAdviceParams.validation.validate(this);
  }

  validateOrThrow() {
    return DeleteAdviceParams.validation.validateOrThrow(this);
  }
}
