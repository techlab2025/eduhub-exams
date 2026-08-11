import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import type Params from '@/base/Core/Params/params';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import PlanModel from '../../core/models/plan.model';
import PlanDetailsModel from '../../core/models/plan.details.model';
import { PlanDurationTypeEnum } from '../../core/enums/plan.duration.enum';
import { PlanStatusEnum } from '../../core/enums/plan.status.enum';
import PlanApiService from '../api/plan.api-service';

export default class PlanRepository extends BaseRepository<PlanDetailsModel, PlanModel[]> {
  private static instance: PlanRepository;
  protected get apiService() {
    return PlanApiService.getInstance();
  }
  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }
  protected get mockItem() {
    return PlanDetailsModel.example;
  }
  protected get mockList() {
    return [
      { ...PlanModel.example, id: 1 },
      {
        ...PlanModel.example,
        title: 'Starter Plan',
        status: PlanStatusEnum.deactivated,
        durationType: PlanDurationTypeEnum.YEAR,
        duration: 12,
        id: 2,
      },
      {
        ...PlanModel.example,
        title: 'Starter Plan',
        status: PlanStatusEnum.DRAFT,
        durationType: PlanDurationTypeEnum.DAY,
        duration: 10,
        id: 3,
      },
      {
        ...PlanModel.example,
        title: 'Starter Plan',
        status: PlanStatusEnum.DRAFT,
        durationType: PlanDurationTypeEnum.WEEK,
        duration: 5,
        id: 4,
      },
      {
        ...PlanModel.example,
        title: 'Starter Plan',
        status: PlanStatusEnum.Archived,
        durationType: PlanDurationTypeEnum.WEEK,
        duration: 5,
        id: 4,
      },
    ];
  }
  static getInstance() {
    if (!this.instance) this.instance = new PlanRepository();
    return this.instance;
  }
  protected parseItem(data: unknown) {
    return PlanDetailsModel.fromJson(data as Record<string, unknown>);
  }
  protected parseList(data: unknown) {
    return Array.isArray(data)
      ? data.map((item) => PlanModel.fromJson(item as Record<string, unknown>))
      : [];
  }

  async toggleStatus(params: Params): Promise<DataState<PlanDetailsModel>> {
    return this.executeCustom(
      () => this.apiService.toggleStatus(params),
      (data) => this.parseItem(data),
    );
  }
}
