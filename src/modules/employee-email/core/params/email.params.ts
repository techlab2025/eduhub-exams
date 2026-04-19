import type Params from "@/base/Core/Params/params";
import { EmailType } from "../constants/emailType.enum";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for creating/updating employee email
 */
export default class EmailParams implements Params {
  public email: string;
  public type: EmailType;
  public employeeId?: number;

  public static readonly validation = new ClassValidation().setRules({
    type: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  });

  constructor(
    email: string,
    type: EmailType = EmailType.EMPLOYEE,
    employeeId?: number,
  ) {
    this.email = email;
    this.type = type;
    this.employeeId = employeeId;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {
      email: this.email,
      type: this.type,
    };

    if (this.employeeId !== undefined) {
      map["id"] = this.employeeId;
    }

    return map;
  }

  validate() {
    return EmailParams.validation.validate(this);
  }

  validateOrThrow() {
    return EmailParams.validation.validateOrThrow(this);
  }
}
