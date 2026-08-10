import IndexParams from '@/base/Core/Params/indexParams';
import type { EmployeeStatusEnm } from '../constant/employee.status.enum';

export default class IndexEmployeeParams extends IndexParams {
  public status?: EmployeeStatusEnm | null;
  constructor(data: {
    word: string;
    pageNumber: number;
    perPage: number;
    withPage: number;
    status: EmployeeStatusEnm | null;
  }) {
    super(data.word, data.pageNumber, data.perPage, data.withPage);
    this.status = data.status;
  }

  toMap(): Record<string, string | number | number[] | null> {
    const map = super.toMap();
    if (this.status != null) {
      map['status'] = this.status;
    }
    map['order_dir'] = 1;
    return map;
  }
}
