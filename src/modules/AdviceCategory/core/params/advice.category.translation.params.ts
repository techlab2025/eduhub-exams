import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class AdviceCategoryTranslationParams implements Params {
  public title: Record<string, string>;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true },
  });

  constructor(data: { title: Record<string, string> }) {
    this.title = data.title;
  }

  toMap(): Record<string, unknown> {
    return { title: this.title };
  }

  validate() {
    return AdviceCategoryTranslationParams.validation.validate(this);
  }

  validateOrThrow() {
    return AdviceCategoryTranslationParams.validation.validateOrThrow(this);
  }
}
