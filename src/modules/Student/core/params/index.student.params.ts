import IndexParams from '@/base/Core/Params/indexParams';
import type { StudentStatusEnum } from '../models/student.model';

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
      ...(this.filters.educationTypeId !== undefined && {
        education_type_id: this.filters.educationTypeId,
      }),
      ...(this.filters.year !== undefined && { year: this.filters.year }),
      ...(this.filters.planId !== undefined && { plan_id: this.filters.planId }),
      ...(this.filters.status !== undefined && { status: this.filters.status }),
      ...(this.filters.joinDateFrom && { join_date_from: this.filters.joinDateFrom }),
      ...(this.filters.joinDateTo && { join_date_to: this.filters.joinDateTo }),
    };
  }
}
