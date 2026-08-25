import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import RoleModel from '../../core/models/role.model';
import RoleApiService from '../api/role.api-service';

export default class RoleRepository extends BaseRepository<RoleModel, RoleModel[]> {
  private static instance: RoleRepository;

  protected get apiService(): RoleApiService {
    return RoleApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }

  protected get mockItem(): RoleModel {
    return RoleModel.example;
  }

  protected get mockList(): RoleModel[] {
    return [RoleModel.example];
  }

  static getInstance(): RoleRepository {
    if (!this.instance) this.instance = new RoleRepository();
    return this.instance;
  }

  protected parseItem(data: unknown): RoleModel {
    return RoleModel.fromJson(data);
  }

  protected parseList(data: unknown): RoleModel[] {
    return Array.isArray(data) ? data.map((item) => RoleModel.fromJson(item)) : [];
  }
}
