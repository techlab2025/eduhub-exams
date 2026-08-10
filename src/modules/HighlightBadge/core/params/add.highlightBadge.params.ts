import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

export default class AddHighLightsBadgesParams implements Params {
  public translations: TranslationParams;

  public static readonly validation = new ClassValidation().setRules({
    translations: { required: true },
  });

  constructor(data: { translations: TranslationParams }) {
    this.translations = data.translations;
  }

  toMap(): Record<string, unknown> {
    return {
      translations: this.translations.toMap(),
    };
  }

  validate() {
    return AddHighLightsBadgesParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddHighLightsBadgesParams.validation.validateOrThrow(this);
  }
}
