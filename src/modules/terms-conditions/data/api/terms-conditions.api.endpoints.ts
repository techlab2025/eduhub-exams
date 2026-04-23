import { BaseEndpoints } from "@/base/Data/Endpoints/BaseEndpoints";

export class TermsConditionsEndpoints extends BaseEndpoints {
  protected readonly prefix = "organization/";

  readonly index = this.url("fetch_terms-conditions");
  readonly show = this.url("show_terms-conditions");
  readonly store = this.url("store_terms-conditions");
  readonly update = this.url("update_terms-conditions");
  readonly delete = this.url("delete_terms-conditions");
}
