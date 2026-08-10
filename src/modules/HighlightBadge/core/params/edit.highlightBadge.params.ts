import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

export default class EditHighLightsBadgesParams implements Params {
  public highlightBadgeId: number;
  public translations: TranslationParams;

  public static readonly validation = new ClassValidation().setRules({
    highlightBadgeId: { required: true },
    translations: { required: true },
  });

  constructor(data: { highlightBadgeId: number; translations: TranslationParams }) {
    this.highlightBadgeId = data.highlightBadgeId;
    this.translations = data.translations;
  }

  toMap(): Record<string, unknown> {
    return {
      highlight_badge_id: this.highlightBadgeId,
      translations: this.translations.toMap(),
    };
  }

  validate() {
    return EditHighLightsBadgesParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditHighLightsBadgesParams.validation.validateOrThrow(this);
  }
}
