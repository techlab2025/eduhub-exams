import BaseRepository, {
  type RepositoryConfig,
} from "@/base/Domain/Repositories/baseRepository";
import DocumentModel from "../../core/models/document.model";
import DocumentApiService from "../api/document.api-service";

export default class DocumentRepository extends BaseRepository<
  DocumentModel,
  DocumentModel[]
> {
  private static instance: DocumentRepository;

  protected get apiService() {
    return DocumentApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: "data",
      paginationKey: "meta",
    };
  }

  protected get mockItem(): DocumentModel {
    return DocumentModel.example;
  }

  protected get mockList(): DocumentModel[] {
    return [
      DocumentModel.example,
      { ...DocumentModel.example, id: 2, title: "Document 2", documentTypeId: 2 },
      { ...DocumentModel.example, id: 3, title: "Document 3", documentTypeId: 3 },
    ];
  }

  static getInstance(): DocumentRepository {
    if (!DocumentRepository.instance) {
      DocumentRepository.instance = new DocumentRepository();
    }
    return DocumentRepository.instance;
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
