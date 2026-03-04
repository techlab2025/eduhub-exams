import BaseRepository, {
  type RepositoryConfig,
} from "@/base/Domain/Repositories/baseRepository";
import EmailModel from "../../core/models/email.model";
import EmailApiService from "../api/email.api-service";

/**
 * Email Repository for API data operations
 *
 * This repository handles all data access for employee emails,
 * including parsing API responses and error handling.
 */
export default class EmailRepository extends BaseRepository<
  EmailModel,
  EmailModel[]
> {
  private static instance: EmailRepository;

  protected get apiService() {
    return EmailApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: "data",
      paginationKey: "meta",
    };
  }

  /**
   * Get singleton instance
   * @returns EmailRepository instance
   */
  static getInstance(): EmailRepository {
    if (!EmailRepository.instance) {
      EmailRepository.instance = new EmailRepository();
    }
    return EmailRepository.instance;
  }

  protected parseItem(data: any): EmailModel {
    return EmailModel.fromJson(data);
  }

  protected parseList(data: any): EmailModel[] {
    if (!Array.isArray(data)) return [];
    return data.map((item) => this.parseItem(item));
  }

}
