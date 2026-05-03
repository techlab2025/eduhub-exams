import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import AboutApiService from '../api/about.api-service';
import AboutModel from '../../core/models/about.model';

export default class AboutRepository extends BaseRepository<AboutModel, AboutModel[]> {
  private static instance: AboutRepository;

  protected get apiService() {
    return AboutApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): AboutModel {
    return AboutModel.example;
  }

  protected get mockList(): AboutModel[] {
    return [AboutModel.example];
  }

  static getInstance(): AboutRepository {
    if (!AboutRepository.instance) {
      AboutRepository.instance = new AboutRepository();
    }
    return AboutRepository.instance;
  }

  protected parseItem(data: any): AboutModel {
    return AboutModel.fromJson(data);
  }

  protected parseList(data: any): AboutModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: AboutModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
