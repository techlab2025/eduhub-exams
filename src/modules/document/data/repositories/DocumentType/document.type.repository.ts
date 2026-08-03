import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import DocumentTypeApiService from '../../api/DocumentType/document.type.api-service';
import DocumentTypeModel from '@/modules/document/core/models/documentType/document.type.model';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';

export default class DocumentTypeRepository extends BaseRepository<
  DocumentTypeModel,
  DocumentTypeModel[]
> {
  private static instance: DocumentTypeRepository;

  protected get apiService() {
    return DocumentTypeApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): DocumentTypeModel {
    return DocumentTypeModel.example;
  }

  protected get mockList(): DocumentTypeModel[] {
    return [
      DocumentTypeModel.example,
      { ...DocumentTypeModel.example, id: 2, title: 'Document 2' },
      { ...DocumentTypeModel.example, id: 3, title: 'Document 3' },
    ];
  }

  static getInstance(): DocumentTypeRepository {
    if (!DocumentTypeRepository.instance) {
      DocumentTypeRepository.instance = new DocumentTypeRepository();
    }
    return DocumentTypeRepository.instance;
  }

  protected parseItem(data: any): DocumentTypeModel {
    return DocumentTypeModel.fromJson(data);
  }

  protected parseList(data: any): DocumentTypeModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: DocumentTypeModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }

  async toggleStatus(params: Params): Promise<DataState<DocumentTypeModel>> {
    return this.executeCustom(
      () => this.apiService.toggleStatus(params),
      (data) => this.parseItem(data),
    );
  }
}
