import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import HighlightBadgeModel from '../../core/models/highlightBadge.model';
import HighlightBadgeApiService from '../api/highlightBadge.api-service';

export default class HighlightBadgeRepository extends BaseRepository<
  HighlightBadgeModel,
  HighlightBadgeModel[]
> {
  private static instance: HighlightBadgeRepository;
  protected get apiService() {
    return HighlightBadgeApiService.getInstance();
  }
  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }
  protected get mockItem() {
    return HighlightBadgeModel.example;
  }
  protected get mockList() {
    return [HighlightBadgeModel.example];
  }
  static getInstance() {
    if (!this.instance) this.instance = new HighlightBadgeRepository();
    return this.instance;
  }
  protected parseItem(data: unknown) {
    return HighlightBadgeModel.fromJson(data as Record<string, unknown>);
  }
  protected parseList(data: unknown) {
    return Array.isArray(data) ? data.map((item) => this.parseItem(item)) : [];
  }
}
