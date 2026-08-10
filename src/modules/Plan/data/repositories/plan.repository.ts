import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import PlanModel from '../../core/models/plan.model';
import PlanApiService from '../api/plan.api-service';

export default class PlanRepository extends BaseRepository<PlanModel, PlanModel[]> {
  private static instance: PlanRepository;
  protected get apiService() {
    return PlanApiService.getInstance();
  }
  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }
  protected get mockItem() {
    return PlanModel.example;
  }
  protected get mockList() {
    return [PlanModel.example];
  }
  static getInstance() {
    if (!this.instance) this.instance = new PlanRepository();
    return this.instance;
  }
  protected parseItem(data: unknown) {
    return PlanModel.fromJson(data as Record<string, unknown>);
  }
  protected parseList(data: unknown) {
    return Array.isArray(data) ? data.map((item) => this.parseItem(item)) : [];
  }
}
