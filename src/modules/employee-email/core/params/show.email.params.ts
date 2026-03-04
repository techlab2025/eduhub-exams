import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for fetching a single employee email (show endpoint).
 * Sends only the employee mail ID in the body.
 */
export default class ShowEmailParams implements Params {
  public id: number;

  public static readonly validation = new ClassValidation().setRules({
    id: { required: true, minLength: 1, maxLength: 100 },
  });

  constructor(id: number) {
    this.id = id;
  }

  toMap(): { [p: string]: any } {
    return {
      id: this.id,
    };
  }

  validate() {
    return ShowEmailParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowEmailParams.validation.validateOrThrow(this);
  }

 
}
