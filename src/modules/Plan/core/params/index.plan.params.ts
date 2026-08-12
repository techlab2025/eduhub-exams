import IndexParams from '@/base/Core/Params/indexParams';
import type { LastUpdatedEnum } from '../enums/plan.last.updated.enum';
import type { PlanStatusEnum } from '../enums/plan.status.enum';

export interface PlanFilters {
  userId?: number;
  fromPrice?: number;
  toPrice?: number;
  duration?: number;
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
      ...(this.filters.userId !== undefined && { user_id: this.filters.userId }),
      ...(this.filters.fromPrice !== undefined && { from_price: this.filters.fromPrice }),
      ...(this.filters.toPrice !== undefined && { to_price: this.filters.toPrice }),
      ...(this.filters.duration !== undefined && {
        duration: String(this.filters.duration),
      }),
      ...(this.filters.hasTrial !== undefined && { has_trail: this.filters.hasTrial }),
      ...(this.filters.status !== undefined && { status: this.filters.status }),
      ...(this.filters.fromDate !== undefined && { from_date: this.filters.fromDate }),
      ...(this.filters.toDate !== undefined && { to_date: this.filters.toDate }),
      ...(this.filters.lastUpdated !== undefined && {
        last_updated: this.filters.lastUpdated,
      }),
    };
  }
}
