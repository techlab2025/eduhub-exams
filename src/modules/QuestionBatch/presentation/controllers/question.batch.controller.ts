import { ref, type Ref } from 'vue';
import type Params from '@/base/Core/Params/params';
import {
  DataCancelled,
  DataInitial,
  DataLoading,
  type DataState,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type GeneratedQuestionBatchModel from '../../core/models/generated.question.batch.model';
import type QuestionBatchModel from '../../core/models/question.batch.model';
import QuestionBatchRepository from '../../data/repositories/question.batch.repository';

export default class QuestionBatchController extends BaseController<
  QuestionBatchModel,
  QuestionBatchModel[]
> {
  private static instance: QuestionBatchController;

  public readonly generationState: Ref<DataState<GeneratedQuestionBatchModel>> = ref(
    new DataInitial<GeneratedQuestionBatchModel>(),
  ) as Ref<DataState<GeneratedQuestionBatchModel>>;

  protected get repository() {
    return QuestionBatchRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showSuccessTosat: false,
      showErrorDialog: false,
      showErrorTosat: true,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  static getInstance(): QuestionBatchController {
    if (!QuestionBatchController.instance) {
      QuestionBatchController.instance = new QuestionBatchController();
    }
    return QuestionBatchController.instance;
  }

  fetchList(params?: Params, options?: ApiCallOptions): Promise<DataState<QuestionBatchModel[]>> {
    return super.fetchList(params, { ...options, useStaticData: true });
  }

  async generateBatch(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<GeneratedQuestionBatchModel>> {
    this.generationState.value = new DataLoading<GeneratedQuestionBatchModel>();
    const result = await this.repository.generateBatch(params, {
      ...options,
      useStaticData: true,
      timeout: 0,
      enableRetry: false,
    });
    this.generationState.value = result;
    if (result.hasError && !(result instanceof DataCancelled)) this.handleErrorResponse(result);
    return result;
  }
}
