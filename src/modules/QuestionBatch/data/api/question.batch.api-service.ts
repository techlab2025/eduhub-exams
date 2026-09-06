import type Params from '@/base/Core/Params/params';
import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type {
  ApiCallOptions,
  ApiEndpoints,
  ApiResponse,
} from '@/base/Data/ApiService/baseApiService';
import { QuestionBatchEndpoints } from './question.batch.api.endpoints';

export default class QuestionBatchApiService extends BaseApiService {
  private static instance: QuestionBatchApiService;
  private readonly questionBatchEndpoints = new QuestionBatchEndpoints();

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.questionBatchEndpoints.index,
      show: this.questionBatchEndpoints.show,
    };
  }

  static getInstance(): QuestionBatchApiService {
    if (!QuestionBatchApiService.instance) {
      QuestionBatchApiService.instance = new QuestionBatchApiService();
    }
    return QuestionBatchApiService.instance;
  }

  generateBatch(params: Params, options?: ApiCallOptions): Promise<ApiResponse> {
    return this.customPost(this.questionBatchEndpoints.store, params, options);
  }
}
