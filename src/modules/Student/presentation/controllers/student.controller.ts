import { ref } from 'vue';
import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type StudentModel from '../../core/models/student.model';
import type ShowStudentModel from '../../core/models/show.student.model';
import type StudentStatsModel from '../../core/models/student.stats.model';
import StudentRepository from '../../data/repositories/student.repository';
import { StudentStatsParams } from '../../core/params/student.stats.params';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
export default class StudentController extends BaseController<ShowStudentModel, StudentModel[]> {
  private static instance: StudentController;
  readonly stats = ref<StudentStatsModel | null>(null);
  protected get repository() {
    return StudentRepository.getInstance();
  }
  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showErrorDialog: false,
      showErrorTosat: true,
      showSuccessTosat: true,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }
  static getInstance() {
    if (!this.instance) this.instance = new StudentController();
    return this.instance;
  }
  async fetchStats() {
    const result = await this.repository.fetchStats(new StudentStatsParams());
    this.stats.value = result.data;
    return result;
  }
  fetchList(params?: Params, options?: ApiCallOptions): Promise<DataState<StudentModel[]>> {
    return super.fetchList(params, options);
  }
  fetchOne(params: Params, options?: ApiCallOptions): Promise<DataState<ShowStudentModel>> {

    return super.fetchOne(params, options);
  }
  changeStatus(params: Params) {
    return this.repository.changeStatus(params);
  }
  forceLogout(params: Params) {
    return this.repository.forceLogout(params);
  }
  addNote(params: Params) {
    return this.repository.addNote(params);
  }
  async delete(params: Params, options?: ApiCallOptions) {
    const result = await super.delete(params, options);
    if (result?.error?.title) {
      dialogManager.toastError(result?.error?.title);
    }
    return result;
  }
}
