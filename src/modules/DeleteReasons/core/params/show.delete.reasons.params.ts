import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for showing a country
 */
export default class ShowDeleteResonsParams implements Params {
  public static readonly validation = new ClassValidation().setRules({});

  constructor() {}

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {};

    return map;
  }

  validate() {
    return ShowDeleteResonsParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowDeleteResonsParams.validation.validateOrThrow(this);
  }
}
