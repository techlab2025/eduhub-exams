import IndexParams from '@/base/Core/Params/indexParams';
import type Params from '@/base/Core/Params/params';
import type { SubscriptionStatusEnum } from '../enums/subscription.status.enum';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

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
      education_type_id: this.filters.educationTypeId,
      plan_id: this.filters.planId,
      status: this.filters.status,
      paied_from: this.filters.paidFrom,
      paied_to: this.filters.paidTo,
      subscription_date_from: this.filters.subscriptionDateFrom,
      subscription_date_to: this.filters.subscriptionDateTo,
      expire_date_from: this.filters.expireDateFrom,
      expire_date_to: this.filters.expireDateTo,
    };
  }
}

export class ShowSubscriptionParams implements Params {
  public id: number;
  private static readonly validation = new ClassValidation().setRules({
    id: { required: true, min: 1 },
  });
  constructor(id: number) {
    this.id = id;
  }
  toMap() {
    return { subscription_id: this.id };
  }
  validate() {
    return ShowSubscriptionParams.validation.validate(this);
  }
  validateOrThrow() {
    return ShowSubscriptionParams.validation.validateOrThrow(this);
  }
}

export class DeleteSubscriptionParams extends ShowSubscriptionParams {}

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
