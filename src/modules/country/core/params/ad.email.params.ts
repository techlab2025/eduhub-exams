import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

export default class CountryParams implements Params {
  public title: string;
  public code: string;
  public flag: string;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
    code: { required: true, minLength: 2, maxLength: 100 },
    flag: { required: true, minLength: 2, maxLength: 100 },
  });

  constructor(title: string, code: string, flag: string) {
    this.title = title;
    this.code = code;
    this.flag = flag;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      title: this.title,
      code: this.code,
      flag: this.flag,
    };
    return map;
  }

  validate() {
    return CountryParams.validation.validate(this);
  }

  validateOrThrow() {
    return CountryParams.validation.validateOrThrow(this);
  }
}
