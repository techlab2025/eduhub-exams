import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import PlacementModel from '../../core/models/placement.model';
import PlacementApiService from '../api/placement.api-service';
import PlacementResultModel from '../../core/models/placementResult';

export default class PlacementRepository extends BaseRepository<
  PlacementModel,
  PlacementResultModel[]
> {
  private static instance: PlacementRepository;

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

  protected get mockItem(): PlacementModel {
    return PlacementModel.example;
  }

  protected get mockList(): PlacementResultModel[] {
    return [
      PlacementResultModel.example,
      PlacementResultModel.example2,
      PlacementResultModel.example3,
    ];
  }

  static getInstance(): PlacementRepository {
    if (!PlacementRepository.instance) {
      PlacementRepository.instance = new PlacementRepository();
    }
    return PlacementRepository.instance;
  }

  protected parseItem(data: any): PlacementModel {
    return PlacementModel.fromJson(data);
  }

  protected parseList(data: any): PlacementResultModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: PlacementResultModel[], item) => {
      try {
        if (item != null) {
          acc.push(PlacementResultModel.fromJson(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
