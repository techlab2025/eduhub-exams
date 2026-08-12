import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';
export class StudentEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_students');
  readonly show = this.url('show_student_details');
  readonly stats = this.url('fetch_students_statics');
  readonly changeStatus = this.url('change_student_status');
  readonly forceLogout = this.url('force_logout_student');
  readonly addNote = this.url('add_student_note');
}
