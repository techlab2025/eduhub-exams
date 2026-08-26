import { env } from '@/base/Core/Config';
import type Params from '@/base/Core/Params/params';
import {
  DataSuccess,
  type DataState,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import DocumentIndexPatchModel from '../../core/models/document.index.patch.model';
import DocumentIndexStatusModel from '../../core/models/document.index.status.model';
import DocumentIndexApiService from '../api/document.index.api-service';

export default class DocumentIndexPatchRepository extends BaseRepository<
  DocumentIndexPatchModel,
  DocumentIndexPatchModel[]
> {
  private static instance: DocumentIndexPatchRepository;

  protected get apiService() {
    return DocumentIndexApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }

  protected get mockItem(): DocumentIndexPatchModel {
    return DocumentIndexPatchModel.example;
  }

  protected get mockList(): DocumentIndexPatchModel[] {
    return [DocumentIndexPatchModel.example];
  }

  static getInstance(): DocumentIndexPatchRepository {
    if (!DocumentIndexPatchRepository.instance) {
      DocumentIndexPatchRepository.instance = new DocumentIndexPatchRepository();
    }
    return DocumentIndexPatchRepository.instance;
  }

  protected parseItem(data: unknown): DocumentIndexPatchModel {
    return DocumentIndexPatchModel.fromJson(data);
  }

  protected parseList(data: unknown): DocumentIndexPatchModel[] {
    if (!Array.isArray(data)) return [];
    return data.map(DocumentIndexPatchModel.fromJson);
  }

  async startIndex(params: Params, options?: ApiCallOptions): Promise<DataState<void>> {
    if (options?.useStaticData ?? env.useStaticData) return new DataSuccess<void>({});

    return this.executeCustom(
      () => this.apiService.createIndex(params, options),
      () => undefined,
      { captureRetryFn: false },
    );
  }

  async checkStatus(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<DocumentIndexStatusModel>> {
    if (options?.useStaticData ?? env.useStaticData) {
      return new DataSuccess({
        data: DocumentIndexStatusModel.fromJson({
          status: 2,
          is_apply: true,
          document_id: DocumentIndexPatchModel.example.documentId,
          generated_index: {
            book_id: DocumentIndexPatchModel.example.documentId,
            book_status: 'completed',
            chapters: [],
          },
        }),
      });
    }

    return this.executeCustom(
      () => this.apiService.checkIndexStatus(params, options),
      DocumentIndexStatusModel.fromJson,
      { captureRetryFn: false },
    );
  }
}
