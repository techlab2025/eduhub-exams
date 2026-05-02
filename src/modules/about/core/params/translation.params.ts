import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new employee
 */
export default class TranslationParams implements Params {
  public title?: Record<string, string>;
  public description?: Record<string, string>;

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: { title?: Record<string, string>; description?: Record<string, string> }) {
    this.title = data.title;
    this.description = data.description;
  }

  toMap(): { [p: string]: any } {
    return {
      title: this.title,
      description: this.description,
    };
  }

  validate() {
    return TranslationParams.validation.validate(this);
  }

  validateOrThrow() {
    return TranslationParams.validation.validateOrThrow(this);
  }
}
