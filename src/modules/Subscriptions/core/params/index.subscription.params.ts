import IndexParams from '@/base/Core/Params/indexParams';
import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { SubscriptionStatusEnum } from '../enums/subscription.status.enum';

export interface SubscriptionFilters {
  educationTypeId?: number;
  planId?: number;
  status?: SubscriptionStatusEnum;
  paidFrom?: number;
  paidTo?: number;
  subscriptionDateFrom?: string;
  subscriptionDateTo?: string;
  expireDateFrom?: string;
  expireDateTo?: string;
}

export class IndexSubscriptionParams extends IndexParams {
  public filters: SubscriptionFilters;
  constructor(word = '', page = 1, perPage = 10, filters: SubscriptionFilters = {}) {
    super(word, page, perPage, 1);
    this.filters = filters;
  }
  toMap() {
    return {
      ...super.toMap(),
      ...(this.filters.educationTypeId !== undefined && {
        education_type_id: this.filters.educationTypeId,
      }),
      ...(this.filters.planId !== undefined && { plan_id: this.filters.planId }),
      ...(this.filters.status !== undefined && { status: this.filters.status }),
      ...(this.filters.paidFrom !== undefined && { paied_from: this.filters.paidFrom }),
      ...(this.filters.paidTo !== undefined && { paied_to: this.filters.paidTo }),
      ...(this.filters.subscriptionDateFrom && {
        subscription_date_from: this.filters.subscriptionDateFrom,
      }),
      ...(this.filters.subscriptionDateTo && {
        subscription_date_to: this.filters.subscriptionDateTo,
      }),
      ...(this.filters.expireDateFrom && { expire_date_from: this.filters.expireDateFrom }),
      ...(this.filters.expireDateTo && { expire_date_to: this.filters.expireDateTo }),
    };
  }
}

export class SubscriptionStatsParams implements Params {
  private static readonly validation = new ClassValidation();
  toMap() {
    return {};
  }
  validate() {
    return SubscriptionStatsParams.validation.validate(this);
  }
  validateOrThrow() {
    return SubscriptionStatsParams.validation.validateOrThrow(this);
  }
}
