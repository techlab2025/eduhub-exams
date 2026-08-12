import type { StudentStatusEnum } from '../models/student.model';
import { ShowStudentParams } from './show.student.params';

export class ChangeStudentStatusParams extends ShowStudentParams {
  public status: StudentStatusEnum;
  public blockReason?: string;

  constructor(id: number, status: StudentStatusEnum, blockReason?: string) {
    super(id);
    this.status = status;
    this.blockReason = blockReason;
  }

  toMap() {
    return {
      ...super.toMap(),
      status: this.status,
      block_reason: this.blockReason,
    };
  }
}
