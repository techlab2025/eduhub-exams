import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for adding a new country
 */
export default class AddFaqsParams implements Params {
  public title: string;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  });

  constructor(title: string) {
    this.title = title;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      title: this.title,
    };
    return map;
  }

  validate() {
    return AddFaqsParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddFaqsParams.validation.validateOrThrow(this);
  }
}
