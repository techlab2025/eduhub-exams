import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

/**
 * Parameters for adding a new employee
 */
export default class AddEmployeeParams implements Params {
  public name: string;
  public email: string;
  public phone: string;
  public password: string;
  public image: string;
  public isSuperadmin: boolean;
  public role_id: number;
  public employeeType: number;

  public static readonly validation = new ClassValidation().setRules({
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, email: true },
    phone: { required: true },
    password: { required: true, minLength: 6 },
    image: { required: false },
    isSuperadmin: { required: true },
    role_id: { required: true },
    employeeType: { required: true },
  });

  constructor(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    image: string;
    isSuperadmin: boolean;
    role_id: number;
    employeeType: number;
  }) {
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.image = data.image;
    this.isSuperadmin = data.isSuperadmin;
    this.role_id = data.role_id;
    this.employeeType = data.employeeType;
  }

  toMap(): { [p: string]: any } {
    return {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      image: this.image,
      isSuperadmin: this.isSuperadmin,
      role_id: this.role_id,
      employeeType: this.employeeType,
    };
  }

  validate() {
    return AddEmployeeParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddEmployeeParams.validation.validateOrThrow(this);
  }
}
