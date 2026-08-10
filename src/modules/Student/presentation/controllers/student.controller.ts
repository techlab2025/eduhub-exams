import { ref } from 'vue';
import BaseController from '@/base/Presentation/Controller/baseController';
import type Params from '@/base/Core/Params/params';
import type StudentModel from '../../core/models/student.model';
import { type StudentStats } from '../../core/models/student.model';
import StudentRepository from '../../data/repositories/student.repository';
import { StudentStatsParams } from '../../core/params/student.params';
export default class StudentController extends BaseController<StudentModel, StudentModel[]> {
  private static instance: StudentController;
  readonly stats = ref<StudentStats | null>(null);
  protected get repository() {
    return StudentRepository.getInstance();
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
  changeStatus(params: Params) {
    return this.repository.changeStatus(params);
  }
  forceLogout(params: Params) {
    return this.repository.forceLogout(params);
  }
}
