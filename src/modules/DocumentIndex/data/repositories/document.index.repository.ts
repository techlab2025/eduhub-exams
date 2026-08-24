import { env } from '@/base/Core/Config';
import type Params from '@/base/Core/Params/params';
import {
  DataCancelled,
  DataSuccess,
  type DataState,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
import DocumentIndexApiService from '../api/document.index.api-service';

const waitForStaticGeneration = (signal?: AbortSignal): Promise<boolean> =>
  new Promise((resolve) => {
    if (signal?.aborted) {
      resolve(false);
      return;
    }

    const finish = () => {
      signal?.removeEventListener('abort', cancel);
      resolve(true);
    };
    const timer = window.setTimeout(finish, 1800);
    const cancel = () => {
      window.clearTimeout(timer);
      resolve(false);
    };

    signal?.addEventListener('abort', cancel, { once: true });
  });

export default class DocumentIndexRepository extends BaseRepository<
  GeneratedDocumentIndexModel,
  GeneratedDocumentIndexModel[]
> {
  private static instance: DocumentIndexRepository;

  protected get apiService() {
    return DocumentIndexApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return { hasPagination: false, dataKey: 'data' };
  }

  protected get mockItem(): GeneratedDocumentIndexModel {
    return GeneratedDocumentIndexModel.example;
  }

  protected get mockList(): GeneratedDocumentIndexModel[] {
    return [GeneratedDocumentIndexModel.example];
  }

  static getInstance(): DocumentIndexRepository {
    if (!DocumentIndexRepository.instance) {
      DocumentIndexRepository.instance = new DocumentIndexRepository();
    }
    return DocumentIndexRepository.instance;
  }

  protected parseItem(data: unknown): GeneratedDocumentIndexModel {
    return GeneratedDocumentIndexModel.fromJson(data);
  }

  protected parseList(data: unknown): GeneratedDocumentIndexModel[] {
    if (!Array.isArray(data)) return [];
    return data.map((item) => GeneratedDocumentIndexModel.fromJson(item));
  }

  async generateIndex(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<GeneratedDocumentIndexModel>> {
    if (options?.useStaticData ?? env.useStaticData) {
      const completed = await waitForStaticGeneration(options?.signal);
      if (!completed) return new DataCancelled();
      const documentId = Number(params.toMap().document_id);
      return new DataSuccess({
        data: new GeneratedDocumentIndexModel({
          bookId: Number.isFinite(documentId) ? documentId : 0,
          bookStatus: GeneratedDocumentIndexModel.example.bookStatus,
          chapters: GeneratedDocumentIndexModel.example.chapters,
        }),
      });
    }

    return this.executeCustom(
      () => this.apiService.createIndex(params, options),
      (data) => GeneratedDocumentIndexModel.fromJson(data),
      { captureRetryFn: false },
    );
  }

  async updateIndex(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<GeneratedDocumentIndexModel>> {
    if (options?.useStaticData ?? env.useStaticData) {
      return new DataSuccess({ data: GeneratedDocumentIndexModel.example });
    }

    return this.executeCustom(
      () => this.apiService.updateIndex(params, options),
      GeneratedDocumentIndexModel.fromJson,
      { captureRetryFn: false },
    );
  }

  async saveIndex(params: Params, options?: ApiCallOptions): Promise<DataState<void>> {
    if (options?.useStaticData ?? env.useStaticData) return new DataSuccess<void>({});

    try {
      const response = await this.apiService.saveIndex(params, options);
      const isSuccessful =
        response.statusCode >= 200 &&
        response.statusCode < 300 &&
        (response.data.status ?? true) !== false;
      if (!isSuccessful) throw new Error(String(response.data.message ?? 'Unable to save index'));
      return new DataSuccess<void>({ message: response.data.message });
    } catch (error) {
      return this.handleError<void>(error);
    }
  }
}
