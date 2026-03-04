import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for deleting an employee email
 */
export default class DeleteParams implements Params {
  public employeeId?: number;


   public static readonly validation = new ClassValidation().setRules({
    employeeId: { required: true, minLength: 1, maxLength: 100 },
  });
    

  constructor(employeeId?: number) {
    this.employeeId = employeeId;
  }

  toMap(): { [p: string]: any } {
    const map: { [key: string]: any } = {};

    if (this.employeeId !== undefined) {
      map["id"] = this.employeeId;
    }

    return map;
  }

  validate() {
    return DeleteParams.validation.validate(this);
  }

  validateOrThrow() {
    return DeleteParams.validation.validateOrThrow(this);
  }

 
}

