import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';
import StudentModel, { type StudentStats } from '../../core/models/student.model';
import StudentApiService from '../api/student.api-service';
export default class StudentRepository extends BaseRepository<StudentModel, StudentModel[]> {
  private static instance: StudentRepository;
  protected get apiService() {
    return StudentApiService.getInstance();
  }
  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }
  protected get mockItem() {
    return StudentModel.example;
  }
  protected get mockList() {
    return [StudentModel.example];
  }
  static getInstance() {
    if (!this.instance) this.instance = new StudentRepository();
    return this.instance;
  }
  protected parseItem(data: unknown) {
    return StudentModel.fromJson(data as Record<string, unknown>);
  }
  protected parseList(data: unknown) {
    return Array.isArray(data) ? data.map((item) => this.parseItem(item)) : [];
  }
  fetchStats(params: Params): Promise<DataState<StudentStats>> {
    return this.executeCustom(() => this.apiService.fetchStats(params), StudentModel.statsFromJson);
  }
  changeStatus(params: Params): Promise<DataState<void>> {
    return this.executeCustom(
      () => this.apiService.changeStatus(params),
      () => undefined,
    );
  }
  forceLogout(params: Params): Promise<DataState<void>> {
    return this.executeCustom(
      () => this.apiService.forceLogout(params),
      () => undefined,
    );
  }
}
