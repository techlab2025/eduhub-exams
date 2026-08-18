import { StudentStatusEnum } from '../models/student.model';
import { ShowStudentParams } from './show.student.params';

export class ChangeStudentStatusParams extends ShowStudentParams {
  public status: StudentStatusEnum;
  public blockReasonId?: number;
  public blockReason?: string;

  constructor(
    id: number,
    status: StudentStatusEnum,
    blockReasonId?: number,
    blockReason?: string,
  ) {
    super(id);
    this.status = status;
    this.blockReasonId = blockReasonId;
    this.blockReason = blockReason;
  }

  toMap() {
    return {
      ...super.toMap(),
      status: this.status,
      ...(this.status === StudentStatusEnum.BLOCK &&
        this.blockReasonId !== undefined && { block_reason_id: [this.blockReasonId] }),
      ...(this.status === StudentStatusEnum.BLOCK &&
        this.blockReason !== undefined && { block_reason: this.blockReason }),
    };
  }
}
