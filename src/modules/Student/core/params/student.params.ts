import IndexParams from '@/base/Core/Params/indexParams';
import type Params from '@/base/Core/Params/params';
import type { StudentStatusEnum } from '../models/student.model';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export interface StudentFilters {
  educationTypeId?: number;
  year?: number;
  planId?: number;
  status?: StudentStatusEnum;
  joinDateFrom?: string;
  joinDateTo?: string;
}
export class IndexStudentParams extends IndexParams {
  public filters: StudentFilters;
  constructor(word = '', page = 1, perPage = 10, filters: StudentFilters = {}) {
    super(word, page, perPage, 1);
    this.filters = filters;
  }
  toMap() {
    return {
      ...super.toMap(),
      education_type_id: this.filters.educationTypeId,
      year: this.filters.year,
      plan_id: this.filters.planId,
      status: this.filters.status,
      join_date_from: this.filters.joinDateFrom,
      join_date_to: this.filters.joinDateTo,
    };
  }
}
export class ShowStudentParams implements Params {
  public id: number;
  private static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });
  constructor(id: number) {
    this.id = id;
  }
  toMap() {
    return { student_id: this.id };
  }
  validate() {
    return ShowStudentParams.validation.validate(this);
  }
  validateOrThrow() {
    return ShowStudentParams.validation.validateOrThrow(this);
  }
}
export class StudentStatsParams implements Params {
  private static readonly validation = new ClassValidation();
  toMap() {
    return {};
  }
  validate() {
    return StudentStatsParams.validation.validate(this);
  }
  validateOrThrow() {
    return StudentStatsParams.validation.validateOrThrow(this);
  }
}
export class ChangeStudentStatusParams extends ShowStudentParams {
  public status: StudentStatusEnum;
  public blockReason?: string;
  constructor(id: number, status: StudentStatusEnum, blockReason?: string) {
    super(id);
    this.status = status;
    this.blockReason = blockReason;
  }
  toMap() {
    return { ...super.toMap(), status: this.status, block_reason: this.blockReason };
  }
}
export class ForceLogoutStudentParams extends ShowStudentParams {}
