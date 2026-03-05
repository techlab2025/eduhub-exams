import BaseApiService from "@/base/Data/ApiService/baseApiService";
import type {
  ApiEndpoints,
  ApiResponse,
} from "@/base/Data/ApiService/baseApiService";
import { ApiNames } from "@/base/Core/NetworkStructure/apiNames";
import type Params from "@/base/Core/Params/params";

export default class LoginApiService extends BaseApiService {
  private static instance: LoginApiService;

  private apiNames = ApiNames.instance;

  /**
   * Singleton instance
   */
  static getInstance(): LoginApiService {
    if (!LoginApiService.instance) {
      LoginApiService.instance = new LoginApiService();
    }
    return LoginApiService.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.apiNames.IndexMail,
      show: this.apiNames.ShowMail,
      create: this.apiNames.loginEmployee,
      update: this.apiNames.EditMail,
      delete: this.apiNames.DeleteMail,
    };
  }
  create(params: Params): Promise<ApiResponse> {
    return this.customPost(this.endpoints.create || "", params);
  }
  // executeEmailAction(params: Params): Promise<ApiResponse> {
  //   return this.customPost(this.endpoints.create || "", params);
  // }
}
