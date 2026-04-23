import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for adding a new country
 */
export default class AddTermsConditionsParams implements Params {
  public terms_conditions: Record<string, string>;
  public static readonly validation = new ClassValidation().setRules({
    terms_conditions: { required: true, minLength: 1 },
  });

  constructor(data: { terms_conditions: Record<string, string> }) {
    this.terms_conditions = data.terms_conditions;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      terms_conditions: this.terms_conditions,
    };
    return map;
  }

  validate() {
    return AddTermsConditionsParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddTermsConditionsParams.validation.validateOrThrow(this);
  }
}
