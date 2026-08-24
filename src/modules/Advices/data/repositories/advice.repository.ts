import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import AdviceModel from '../../core/models/advice.model';
import AdviceApiService from '../api/advice.api-service';

export default class AdviceRepository extends BaseRepository<AdviceModel, AdviceModel[]> {
  private static instance: AdviceRepository;

  protected get apiService() {
    return AdviceApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }

  protected get mockItem() {
    return AdviceModel.example;
  }

  protected get mockList() {
    return [AdviceModel.example];
  }

  static getInstance() {
    if (!this.instance) this.instance = new AdviceRepository();
    return this.instance;
  }

  protected parseItem(data: unknown) {
    return AdviceModel.fromJson(data as Record<string, unknown>);
  }

  protected parseList(data: unknown) {
    return Array.isArray(data) ? data.map((item) => this.parseItem(item)) : [];
  }
}
