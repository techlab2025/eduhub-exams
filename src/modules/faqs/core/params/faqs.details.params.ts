import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for fetching a single FAQ
 */
export default class FaqsDetailsParams implements Params {
  public id: number;
  public isLocale?: boolean;

  public static readonly validation = new ClassValidation().setRules({
    id: { required: true },
  });

  constructor(data: { id: number; isLocale?: boolean }) {
    this.id = data.id;
    this.isLocale = data.isLocale;
  }

  toMap(): Record<string, unknown> {
    return {
      faq_id: this.id,
    };
  }

  validate() {
    return FaqsDetailsParams.validation.validate(this);
  }

  validateOrThrow() {
    return FaqsDetailsParams.validation.validateOrThrow(this);
  }
}
