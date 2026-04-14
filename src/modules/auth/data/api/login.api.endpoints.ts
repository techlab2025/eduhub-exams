import { BaseEndpoints } from "@/base/Data/Endpoints/BaseEndpoints";

export class LoginEndpoints extends BaseEndpoints {
  protected readonly prefix = "organization/";

  readonly index = this.url("fetch_employee_emails");
  readonly show = this.url("show_employee_email");
  readonly store = this.url("store_employee_email");
  readonly update = this.url("update_employee_email");
  readonly delete = this.url("delete_employee_email");
  readonly login = this.url("login_employee");
}
