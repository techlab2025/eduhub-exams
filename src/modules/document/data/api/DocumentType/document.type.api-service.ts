import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints, ApiResponse } from '@/base/Data/ApiService/baseApiService';
import { DocumentTypeEndpoints } from './document.type.api.endpoints';
import type Params from '@/base/Core/Params/params';

export default class DocumentTypeApiService extends BaseApiService {
  private static instance: DocumentTypeApiService;

  private readonly documentTypeEndpoints = new DocumentTypeEndpoints();

  static getInstance(): DocumentTypeApiService {
    if (!DocumentTypeApiService.instance) {
      DocumentTypeApiService.instance = new DocumentTypeApiService();
    }
    return DocumentTypeApiService.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      create: this.documentTypeEndpoints.store,
      index: this.documentTypeEndpoints.index,
      delete: this.documentTypeEndpoints.delete,
      update: this.documentTypeEndpoints.update,
      show: this.documentTypeEndpoints.show,
    };
  }
  toggleStatus(params: Params): Promise<ApiResponse> {
    return this.customPost(this.documentTypeEndpoints.status || '', params);
  }
}
