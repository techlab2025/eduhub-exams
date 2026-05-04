import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

/**
 * Parameters for adding a new employee
 */
export default class AddEmployeeParams implements Params {
  public firstname: string;
  public lastname: string;
  public email: string;
  public phone: string;
  public password: string;
  public image: string;
  public isSuperadmin: boolean;
  public EmployeeId: string;
  public employeeType: number;

  public static readonly validation = new ClassValidation().setRules({
    firstname: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true },
    phone: { required: true },
    password: { required: true, minLength: 6 },
    image: { required: false },
    isSuperadmin: { required: true },
    EmployeeId: { required: true },
    employeeType: { required: true },
  });

  constructor(data: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    image: string;
    isSuperadmin: boolean;
    EmployeeId: string;
    employeeType: number;
  }) {
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.image = data.image;
    this.isSuperadmin = data.isSuperadmin;
    this.EmployeeId = data.EmployeeId;
    this.employeeType = data.employeeType;
  }

  toMap(): { [p: string]: any } {
    return {
      first_name: this.firstname,
      last_name: this.lastname,
      email: this.email,
      phone: this.phone,
      password: this.password,
      image: this.image,
      isSuperadmin: this.isSuperadmin,
      employee_id: this.EmployeeId,
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
