import BaseApiService from "@/base/Data/ApiService/baseApiService";
import type {
  ApiEndpoints,
  ApiResponse,
} from "@/base/Data/ApiService/baseApiService";
import type Params from "@/base/Core/Params/params";
import { EmailEndpoints } from "./email.api.endpoints";

export default class EmailApiService extends BaseApiService {
  private static instance: EmailApiService;

  private readonly emailEndpoints = new EmailEndpoints();

  /**
   * Singleton instance
   */
  static getInstance(): EmailApiService {
    if (!EmailApiService.instance) {
      EmailApiService.instance = new EmailApiService();
    }
    return EmailApiService.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.emailEndpoints.index,
      show: this.emailEndpoints.show,
      create: this.emailEndpoints.store,
      update: this.emailEndpoints.update,
      delete: this.emailEndpoints.delete,
    };
  }

  executeEmailAction(params: Params): Promise<ApiResponse> {
    return this.customPost(this.endpoints.create || "", params);
  }
}
