import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import DocumentTypeApiService from '../../api/DocumentType/document.type.api-service';
import DocumentModel from '@/modules/document/core/models/document.model';

export default class DocumentTypeRepository extends BaseRepository<DocumentModel, DocumentModel[]> {
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

  protected get mockItem(): DocumentModel {
    return DocumentModel.example;
  }

  protected get mockList(): DocumentModel[] {
    return [
      DocumentModel.example,
      { ...DocumentModel.example, id: 2, title: 'Document 2', documentTypeId: 2 },
      { ...DocumentModel.example, id: 3, title: 'Document 3', documentTypeId: 3 },
    ];
  }

  static getInstance(): DocumentTypeRepository {
    if (!DocumentTypeRepository.instance) {
      DocumentTypeRepository.instance = new DocumentTypeRepository();
    }
    return DocumentTypeRepository.instance;
  }

  protected parseItem(data: any): DocumentModel {
    return DocumentModel.fromJson(data);
  }

  protected parseList(data: any): DocumentModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: DocumentModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
