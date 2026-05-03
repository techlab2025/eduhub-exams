import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

/**
 * Parameters for showing a country
 */
export default class EditDeleteResonsParams implements Params {
  public id: number;
  public translations: TranslationParams;

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: { translations: TranslationParams; id: number }) {
    this.translations = data.translations;
    this.id = data.id;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {};

    return map;
  }

  validate() {
    return EditDeleteResonsParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditDeleteResonsParams.validation.validateOrThrow(this);
  }
}
