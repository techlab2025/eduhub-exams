import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type AdviceCategoryTranslationParams from './advice.category.translation.params';

export default class EditAdviceCategoryParams implements Params {
  public adviceCategoryId: number;
  public translations: AdviceCategoryTranslationParams;

  public static readonly validation = new ClassValidation().setRules({
    adviceCategoryId: { required: true },
    translations: { required: true },
  });

  constructor(data: { adviceCategoryId: number; translations: AdviceCategoryTranslationParams }) {
    this.adviceCategoryId = data.adviceCategoryId;
    this.translations = data.translations;
  }

  toMap(): Record<string, unknown> {
    return {
      category_id: this.adviceCategoryId,
      translations: this.translations.toMap(),
    };
  }

  validate() {
    return EditAdviceCategoryParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditAdviceCategoryParams.validation.validateOrThrow(this);
  }
}
