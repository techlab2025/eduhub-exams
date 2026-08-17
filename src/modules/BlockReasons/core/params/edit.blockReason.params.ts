import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

export default class EditBlockReasonsParams implements Params {
  public blockReasonId: number;
  public translations: TranslationParams;

  public static readonly validation = new ClassValidation().setRules({
    blockReasonId: { required: true },
    translations: { required: true },
  });

  constructor(data: { blockReasonId: number; translations: TranslationParams }) {
    this.blockReasonId = data.blockReasonId;
    this.translations = data.translations;
  }

  toMap(): Record<string, unknown> {
    return {
      block_reason_id: this.blockReasonId,
      translations: this.translations.toMap(),
    };
  }

  validate() {
    return EditBlockReasonsParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditBlockReasonsParams.validation.validateOrThrow(this);
  }
}
