import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';

import PlcaementTestModel from '../../core/models/placement.test.model';
import ShowPlcaementTestModel from '../../core/models/show.placement.test.model';
import PlacementApiService from '../api/placement.test.api-service';

export default class PlacementTestRepository extends BaseRepository<
  ShowPlcaementTestModel,
  PlcaementTestModel[]
> {
  private static instance: PlacementTestRepository;

  protected get apiService() {
    return PlacementApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): ShowPlcaementTestModel {
    return ShowPlcaementTestModel.example;
  }

  protected get mockList(): PlcaementTestModel[] {
    return [PlcaementTestModel.example];
  }

  static getInstance(): PlacementTestRepository {
    if (!PlacementTestRepository.instance) {
      PlacementTestRepository.instance = new PlacementTestRepository();
    }
    return PlacementTestRepository.instance;
  }

  protected parseItem(data: any): ShowPlcaementTestModel {
    return ShowPlcaementTestModel.fromJson(data);
  }

  protected parseList(data: any): PlcaementTestModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: PlcaementTestModel[], item) => {
      try {
        if (item != null) {
          acc.push(PlcaementTestModel.fromJson(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
