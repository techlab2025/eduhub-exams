import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class DocumentTranslationParams implements Params {
  public description: Record<string, string>;

  public static readonly validation = new ClassValidation().setRules({
    description: { required: true },
  });

  constructor(data: { description: Record<string, string> }) {
    this.description = data.description;
  }

  toMap(): { [p: string]: any } {
    return {
      description: this.description,
    };
  }

  validate() {
    return DocumentTranslationParams.validation.validate(this);
  }

  validateOrThrow() {
    return DocumentTranslationParams.validation.validateOrThrow(this);
  }
}
