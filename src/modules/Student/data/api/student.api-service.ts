import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints, ApiResponse } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { StudentEndpoints } from './student.api.endpoints';
export default class StudentApiService extends BaseApiService {
  private static instance: StudentApiService;
  private readonly studentEndpoints = new StudentEndpoints();
  static getInstance() {
    if (!this.instance) this.instance = new StudentApiService();
    return this.instance;
  }
  protected get endpoints(): Partial<ApiEndpoints> {
    return { index: this.studentEndpoints.index, show: this.studentEndpoints.show };
  }
  fetchStats(params: Params): Promise<ApiResponse> {
    return this.customPost(this.studentEndpoints.stats, params);
  }
  changeStatus(params: Params): Promise<ApiResponse> {
    return this.customPost(this.studentEndpoints.changeStatus, params);
  }
  forceLogout(params: Params): Promise<ApiResponse> {
    return this.customPost(this.studentEndpoints.forceLogout, params);
  }
  addNote(params: Params): Promise<ApiResponse> {
    return this.customPost(this.studentEndpoints.addNote, params);
  }
}
