import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type AdviceCategoryTranslationParams from './advice.category.translation.params';

export default class AddAdviceCategoryParams implements Params {
  public translations: AdviceCategoryTranslationParams;

  public static readonly validation = new ClassValidation().setRules({
    translations: { required: true },
  });

  constructor(data: { translations: AdviceCategoryTranslationParams }) {
    this.translations = data.translations;
  }

  toMap(): Record<string, unknown> {
    return { translations: this.translations.toMap() };
  }

  validate() {
    return AddAdviceCategoryParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddAdviceCategoryParams.validation.validateOrThrow(this);
  }
}
