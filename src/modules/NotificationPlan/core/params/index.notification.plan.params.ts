import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { StatusNotificationPlanEnum } from '../enums/status.notification.plan.enum';

export interface IndexNotificationPlanParamsData {
  word?: string;
  with_pagination?: number;
  page?: number;
  per_page?: number;
  status?: StatusNotificationPlanEnum;
  employee_id?: number;
  action?: number;
  feature?: number;
}

export default class IndexNotificationPlanParams implements Params {
  public word?: string;
  public with_pagination?: number;
  public page?: number;
  public per_page?: number;
  public status?: StatusNotificationPlanEnum;
  public employee_id?: number;
  public action?: number;
  public feature?: number;

  private static readonly validation = new ClassValidation().setRules({
    page: { min: 1 },
    per_page: { min: 1 },
  });

  constructor(data: IndexNotificationPlanParamsData = {}) {
    this.word = data.word;
    this.with_pagination = data.with_pagination;
    this.page = data.page;
    this.per_page = data.per_page;
    this.status = data.status;
    this.employee_id = data.employee_id;
    this.action = data.action;
    this.feature = data.feature;
  }

  toMap(): Record<string, unknown> {
    return {
      ...(this.word ? { word: this.word } : {}),
      ...(this.with_pagination !== undefined ? { with_pagination: this.with_pagination } : {}),
      ...(this.page !== undefined ? { page: this.page } : {}),
      ...(this.per_page !== undefined ? { per_page: this.per_page } : {}),
      ...(this.status !== undefined ? { status: this.status } : {}),
      ...(this.employee_id !== undefined ? { employee_id: this.employee_id } : {}),
      ...(this.action !== undefined ? { action: this.action } : {}),
      ...(this.feature !== undefined ? { feature: this.feature } : {}),
    };
  }

  validate() {
    return IndexNotificationPlanParams.validation.validate(this);
  }

  validateOrThrow() {
    return IndexNotificationPlanParams.validation.validateOrThrow(this);
  }
}
