import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import type Params from '@/base/Core/Params/params';
import {
  DataFailed,
  type DataState,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import NotificationPlanModel from '../../core/models/notification.plan.model';
import NotificationPlanDetailsModel from '../../core/models/notification.plan.details.model';
import NotificationPlanApiService from '../api/notification.plan.api-service';

export default class NotificationPlanRepository extends BaseRepository<
  NotificationPlanDetailsModel,
  NotificationPlanModel[]
> {
  private static instance: NotificationPlanRepository;

  protected get apiService() {
    return NotificationPlanApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }

  protected get mockItem(): NotificationPlanDetailsModel {
    return NotificationPlanDetailsModel.example;
  }

  protected get mockList(): NotificationPlanModel[] {
    return [NotificationPlanModel.example];
  }

  static getInstance(): NotificationPlanRepository {
    if (!this.instance) this.instance = new NotificationPlanRepository();
    return this.instance;
  }

  protected parseItem(data: unknown): NotificationPlanDetailsModel {
    return NotificationPlanDetailsModel.fromJson((data ?? {}) as Record<string, unknown>);
  }

  protected parseList(data: unknown): NotificationPlanModel[] {
    return Array.isArray(data)
      ? data.map((item) => NotificationPlanModel.fromJson(item as Record<string, unknown>))
      : [];
  }

  async toggleStatus(params: Params): Promise<DataState<void>> {
    const retryFn = () => this.toggleStatus(params);

    try {
      const response = await this.apiService.toggleStatus(params);
      const responseData = response.data as { status?: boolean; message?: string };
      const isSuccess =
        response.statusCode >= 200 && response.statusCode < 300 && (responseData.status ?? true);

      if (isSuccess) {
        return new DataSuccess<void>({ message: responseData.message });
      }

      return new DataFailed<void>({
        error: new ErrorModel(responseData.message ?? 'Unknown error', ErrorType.serviceSide),
      });
    } catch (error) {
      return this.handleError(error, retryFn);
    }
  }
}
