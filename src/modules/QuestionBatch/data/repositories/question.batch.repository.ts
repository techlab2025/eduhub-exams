import { env } from '@/base/Core/Config';
import type Params from '@/base/Core/Params/params';
import {
  DataCancelled,
  DataSuccess,
  type DataState,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import GeneratedQuestionBatchModel from '../../core/models/generated.question.batch.model';
import QuestionBatchModel from '../../core/models/question.batch.model';
import QuestionBatchApiService from '../api/question.batch.api-service';

const waitForStaticBatch = (signal?: AbortSignal): Promise<boolean> =>
  new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(false);
      return;
    }
    const finish = () => {
      signal?.removeEventListener('abort', cancel);
      resolve(true);
    };
    const timer = window.setTimeout(finish, 1500);
    const cancel = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    signal?.addEventListener('abort', cancel, { once: true });
  });

export default class QuestionBatchRepository extends BaseRepository<
  QuestionBatchModel,
  QuestionBatchModel[]
> {
  private static instance: QuestionBatchRepository;

  protected get apiService() {
    return QuestionBatchApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }

  protected get mockItem(): QuestionBatchModel {
    return QuestionBatchModel.example;
  }

  protected get mockList(): QuestionBatchModel[] {
    return [QuestionBatchModel.example];
  }

  static getInstance(): QuestionBatchRepository {
    if (!QuestionBatchRepository.instance) {
      QuestionBatchRepository.instance = new QuestionBatchRepository();
    }
    return QuestionBatchRepository.instance;
  }

  protected parseItem(data: unknown): QuestionBatchModel {
    return QuestionBatchModel.fromJson(data);
  }

  protected parseList(data: unknown): QuestionBatchModel[] {
    if (!Array.isArray(data)) return [];
    return data.map(QuestionBatchModel.fromJson);
  }

  async generateBatch(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<GeneratedQuestionBatchModel>> {
    if (options?.useStaticData ?? env.useStaticData) {
      const completed = await waitForStaticBatch(options?.signal);
      return completed
        ? new DataSuccess({ data: GeneratedQuestionBatchModel.example })
        : new DataCancelled();
    }

    return this.executeCustom(
      () => this.apiService.generateBatch(params, options),
      GeneratedQuestionBatchModel.fromJson,
      { captureRetryFn: false },
    );
  }
}
