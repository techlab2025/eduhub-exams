import { env } from '@/base/Core/Config';
import type Params from '@/base/Core/Params/params';
import {
  DataFailed,
  DataSuccess,
  type DataState,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import { DocumentIndexPatchStatusEnum } from '../../core/constant/document.index.patch.status.enum';
import DocumentIndexPatchModel from '../../core/models/document.index.patch.model';
import DocumentIndexStatusModel from '../../core/models/document.index.status.model';
import DocumentIndexApiService from '../api/document.index.api-service';

const startIdentifier = (value: unknown, depth = 0): number => {
  const numericValue = SaftyConditions.numberValue(value);
  if (numericValue > 0) return numericValue;

  if (typeof value === 'string') {
    const numericSuffix = value.match(/(\d+)$/)?.[1];
    if (numericSuffix) return SaftyConditions.numberValue(numericSuffix);
  }

  if (depth >= 2) return 0;
  const data = SaftyConditions.objectValue(value);
  const directKeys = [
    'id',
    'patch_id',
    'index_patch_id',
    'document_index_patch_id',
    'transaction_id',
    'index_transaction_id',
    'document_index_transaction_id',
  ];
  for (const key of directKeys) {
    const identifier = startIdentifier(data[key], depth + 1);
    if (identifier > 0) return identifier;
  }

  const nestedKeys = [
    'data',
    'patch',
    'index_patch',
    'document_index_patch',
    'transaction',
    'index_transaction',
    'document_index_transaction',
    'job',
  ];
  for (const key of nestedKeys) {
    const identifier = startIdentifier(data[key], depth + 1);
    if (identifier > 0) return identifier;
  }

  return 0;
};

const isSuccessfulStartResponse = (statusCode: number, body: Record<string, unknown>): boolean =>
  [200, 201, 202].includes(statusCode) &&
  body.status !== false &&
  body.status !== 0 &&
  body.status !== '0' &&
  body.status !== 'false';

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

  async startIndex(params: Params, options?: ApiCallOptions): Promise<DataState<number>> {
    if (options?.useStaticData ?? env.useStaticData) {
      return new DataSuccess<number>({ data: DocumentIndexPatchModel.example.id });
    }

    try {
      const response = await this.apiService.createIndex(params, options);
      const body = SaftyConditions.objectValue(response.data);
      if (!isSuccessfulStartResponse(response.statusCode, body)) {
        return new DataFailed({
          error: new ErrorModel(
            String(body.message ?? 'Document indexing could not be started.'),
            ErrorType.serviceSide,
          ),
        });
      }

      const responseIdentifier = startIdentifier(body.data ?? response.data);
      const documentId = SaftyConditions.numberValue(params.toMap().document_id);
      const patchId = responseIdentifier || documentId;
      if (!patchId) {
        return new DataFailed({
          error: new ErrorModel(
            'The indexing response did not contain a usable identifier.',
            ErrorType.dataDirty,
          ),
        });
      }

      return new DataSuccess<number>({
        data: patchId,
        message: typeof body.message === 'string' ? body.message : null,
      });
    } catch (error) {
      return this.handleError<number>(error);
    }
  }

  async refreshStatus(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<DocumentIndexStatusModel>> {
    if (options?.useStaticData ?? env.useStaticData) {
      return new DataSuccess({
        data: DocumentIndexStatusModel.fromJson({
          status: DocumentIndexPatchStatusEnum.COMPLETE,
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
      () => this.apiService.refreshIndexStatus(params, options),
      DocumentIndexStatusModel.fromJson,
      { captureRetryFn: false },
    );
  }
}
