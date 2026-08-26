import type Params from '@/base/Core/Params/params';
import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type {
  ApiCallOptions,
  ApiEndpoints,
  ApiResponse,
} from '@/base/Data/ApiService/baseApiService';
import { DocumentIndexEndpoints } from './document.index.api.endpoints';

export default class DocumentIndexApiService extends BaseApiService {
  private static instance: DocumentIndexApiService;
  private readonly documentIndexEndpoints = new DocumentIndexEndpoints();

  protected get endpoints(): Partial<ApiEndpoints> {
    return { index: this.documentIndexEndpoints.indexPatches };
  }

  static getInstance(): DocumentIndexApiService {
    if (!DocumentIndexApiService.instance) {
      DocumentIndexApiService.instance = new DocumentIndexApiService();
    }
    return DocumentIndexApiService.instance;
  }

  createIndex(params: Params, options?: ApiCallOptions): Promise<ApiResponse> {
    return this.customPost(this.documentIndexEndpoints.createIndex, params, options);
  }

  checkIndexStatus(params: Params, options?: ApiCallOptions): Promise<ApiResponse> {
    return this.customPost(this.documentIndexEndpoints.checkIndexStatus, params, options);
  }

  updateIndex(params: Params, options?: ApiCallOptions): Promise<ApiResponse> {
    return this.customPost(this.documentIndexEndpoints.updateIndex, params, options);
  }

  saveIndex(params: Params, options?: ApiCallOptions): Promise<ApiResponse> {
    return this.customPost(this.documentIndexEndpoints.saveIndex, params, options);
  }
}
