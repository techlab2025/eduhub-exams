import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

export default class AddAdviceParams implements Params {
  public translations: TranslationParams;
  public adviceCategoryId: number;

  public static readonly validation = new ClassValidation().setRules({
    translations: { required: true },
    adviceCategoryId: { required: true },
  });

  constructor(data: { translations: TranslationParams; adviceCategoryId: number }) {
    this.translations = data.translations;
    this.adviceCategoryId = data.adviceCategoryId;
  }

  toMap(): Record<string, unknown> {
    return {
      advice_category_id: this.adviceCategoryId,
      translations: this.translations.toMap(),
    };
  }

  validate() {
    return AddAdviceParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddAdviceParams.validation.validateOrThrow(this);
  }
}
