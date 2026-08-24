import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

export default class EditAdviceParams implements Params {
  public adviceId: number;
  public translations: TranslationParams;
  public adviceCategoryId: number;

  public static readonly validation = new ClassValidation().setRules({
    adviceId: { required: true },
    translations: { required: true },
    adviceCategoryId: { required: true },
  });

  constructor(data: {
    adviceId: number;
    translations: TranslationParams;
    adviceCategoryId: number;
  }) {
    this.adviceId = data.adviceId;
    this.translations = data.translations;
    this.adviceCategoryId = data.adviceCategoryId;
  }

  toMap(): Record<string, unknown> {
    return {
      advice_id: this.adviceId,
      advice_category_id: this.adviceCategoryId,
      translations: this.translations.toMap(),
    };
  }

  validate() {
    return EditAdviceParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditAdviceParams.validation.validateOrThrow(this);
  }
}
