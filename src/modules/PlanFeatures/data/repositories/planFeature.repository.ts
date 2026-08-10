import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import PlanFeatureModel from '../../core/models/planFeature.model';
import PlanFeatureApiService from '../api/planFeature.api-service';

export default class PlanFeatureRepository extends BaseRepository<
  PlanFeatureModel,
  PlanFeatureModel[]
> {
  private static instance: PlanFeatureRepository;
  protected get apiService() {
    return PlanFeatureApiService.getInstance();
  }
  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }
  protected get mockItem() {
    return PlanFeatureModel.example;
  }
  protected get mockList() {
    return [PlanFeatureModel.example];
  }
  static getInstance() {
    if (!this.instance) this.instance = new PlanFeatureRepository();
    return this.instance;
  }
  protected parseItem(data: unknown) {
    return PlanFeatureModel.fromJson(data as Record<string, unknown>);
  }
  protected parseList(data: unknown) {
    return Array.isArray(data) ? data.map((item) => this.parseItem(item)) : [];
  }
}
