import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EmployeePermissionModel from '../../core/models/employee.permission.model';
import PermissionApiService from '../api/permission.api-service';

export default class PermissionRepository extends BaseRepository<
  EmployeePermissionModel,
  EmployeePermissionModel[]
> {
  private static instance: PermissionRepository;

  protected get apiService() {
    return PermissionApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return { hasPagination: false, dataKey: 'data' };
  }

  protected get mockItem(): EmployeePermissionModel {
    return EmployeePermissionModel.example;
  }

  protected get mockList(): EmployeePermissionModel[] {
    return [EmployeePermissionModel.example];
  }

  static getInstance(): PermissionRepository {
    if (!this.instance) this.instance = new PermissionRepository();
    return this.instance;
  }

  protected parseItem(data: unknown): EmployeePermissionModel {
    return EmployeePermissionModel.fromJson(data);
  }

  protected parseList(data: unknown): EmployeePermissionModel[] {
    return Array.isArray(data) ? data.map(EmployeePermissionModel.fromJson) : [];
  }
}
