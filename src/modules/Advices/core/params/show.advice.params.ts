import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class ShowAdviceParams implements Params {
  public adviceId: number;
  public allLocales: boolean;

  public static readonly validation = new ClassValidation().setRules({
    adviceId: { required: true },
  });

  constructor(data: { adviceId: number; allLocales?: boolean }) {
    this.adviceId = data.adviceId;
    this.allLocales = data.allLocales ?? true;
  }

  toMap(): Record<string, unknown> {
    return { advice_id: this.adviceId };
  }

  validate() {
    return ShowAdviceParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowAdviceParams.validation.validateOrThrow(this);
  }
}
