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
          documentId: Number.isFinite(documentId) ? documentId : undefined,
          items: GeneratedDocumentIndexModel.example.items,
        }),
      });
    }

    return this.executeCustom(
      () => this.apiService.generateIndex(params, options),
      (data) => GeneratedDocumentIndexModel.fromJson(data),
      { captureRetryFn: false },
    );
  }
}
