import IndexParams from '@/base/Core/Params/indexParams';
import type { LastUpdatedEnum } from '../enums/plan.last.updated.enum';
import type { PlanStatusEnum } from '../enums/plan.status.enum';

export interface PlanFilters {
  userId?: number;
  fromPrice?: number;
  toPrice?: number;
  duration?: string;
  hasTrial?: boolean;
  status?: PlanStatusEnum;
  fromDate?: string;
  toDate?: string;
  lastUpdated?: LastUpdatedEnum;
}

export default class IndexPlanParams extends IndexParams {
  public filters: PlanFilters;

  constructor(word = '', page = 1, perPage = 10, filters: PlanFilters = {}) {
    super(word, page, perPage, 1);
    this.filters = filters;
  }

  toMap() {
    return {
      ...super.toMap(),
      user_id: this.filters.userId,
      from_price: this.filters.fromPrice,
      to_price: this.filters.toPrice,
      duration: this.filters.duration,
      has_trail: this.filters.hasTrial,
      status: this.filters.status,
      from_date: this.filters.fromDate,
      to_date: this.filters.toDate,
      last_updated: this.filters.lastUpdated,
    };
  }
}
