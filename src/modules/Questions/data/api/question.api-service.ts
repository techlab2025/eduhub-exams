import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints, ApiResponse } from '@/base/Data/ApiService/baseApiService';
import { QuestionEndpoints } from './question.api.endpoints';
import type Params from '@/base/Core/Params/params';

export default class QuestionApiService extends BaseApiService {
  private static instance: QuestionApiService;

  private readonly questionEndpoints = new QuestionEndpoints();

  /**
   * Singleton instance
   */
  static getInstance(): QuestionApiService {
    if (!QuestionApiService.instance) {
      QuestionApiService.instance = new QuestionApiService();
    }
    return QuestionApiService.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.questionEndpoints.index,
      show: this.questionEndpoints.show,
      create: this.questionEndpoints.store,
      update: this.questionEndpoints.update,
      delete: this.questionEndpoints.delete,
    };
  }

  updateReviewStatus(params: Params): Promise<ApiResponse> {
    return this.customPost(this.questionEndpoints.updateReviewStatus || '', params, {
      enableRetry: false,
    });
  }

  async QuestionHistory(params: Params): Promise<ApiResponse> {
    return this.customPost(this.questionEndpoints.history, params);
  }
}
