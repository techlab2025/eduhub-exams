import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

export default class EditAdviceParams implements Params {
  public adviceId: number;
  public translations: TranslationParams;

  public static readonly validation = new ClassValidation().setRules({
    adviceId: { required: true },
    translations: { required: true },
  });

  constructor(data: { adviceId: number; translations: TranslationParams }) {
    this.adviceId = data.adviceId;
    this.translations = data.translations;
  }

  toMap(): Record<string, unknown> {
    return { advice_id: this.adviceId, translations: this.translations.toMap() };
  }

  validate() {
    return EditAdviceParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditAdviceParams.validation.validateOrThrow(this);
  }
}
