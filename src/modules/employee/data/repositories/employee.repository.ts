import BaseRepository from '@/base/Domain/Repositories/baseRepository';
import type { RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EmployeeModel from '../../core/models/employee.model';
import EmployeeApiService from '../api/employee.api-service';
import type IEmployeeRepo from '../../domain/repositories/employee.repo';

export default class EmployeeRepository
  extends BaseRepository<EmployeeModel, EmployeeModel[]>
  implements IEmployeeRepo
{
  private static instance: EmployeeRepository;

  protected get apiService() {
    return EmployeeApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      ...super.config,
      hasPagination: true,
    };
  }

  /**
   * Singleton instance
   */
  static getInstance(): EmployeeRepository {
    if (!EmployeeRepository.instance) {
      EmployeeRepository.instance = new EmployeeRepository();
    }
    return EmployeeRepository.instance;
  }

  protected parseItem(data: any): EmployeeModel {
    return EmployeeModel.fromJson(data);
  }

  protected parseList(data: any): EmployeeModel[] {
    return data.map((item: any) => EmployeeModel.fromJson(item));
  }

  protected get mockItem(): EmployeeModel {
    return EmployeeModel.example;
  }

  protected get mockList(): EmployeeModel[] {
    return [EmployeeModel.example];
  }
}
