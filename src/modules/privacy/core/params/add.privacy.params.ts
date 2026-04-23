import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for adding a new country
 */
export default class AddPrivacyParams implements Params {
  public privacy: Record<string, string>;
  public static readonly validation = new ClassValidation().setRules({
    privacy: { required: true, minLength: 1 },
  });

  constructor(data: { privacy: Record<string, string> }) {
    this.privacy = data.privacy;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      privacy: this.privacy,
    };
    return map;
  }

  validate() {
    return AddPrivacyParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddPrivacyParams.validation.validateOrThrow(this);
  }
}
