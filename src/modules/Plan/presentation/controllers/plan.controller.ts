import BaseController from '@/base/Presentation/Controller/baseController';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type PlanModel from '../../core/models/plan.model';
import type PlanDetailsModel from '../../core/models/plan.details.model';
import PlanRepository from '../../data/repositories/plan.repository';
import type AddPlanParams from '../../core/params/add.plan.params';
import { PlanStatusEnum } from '../../core/enums/plan.status.enum';

export default class PlanController extends BaseController<PlanDetailsModel, PlanModel[]> {
  private static instance: PlanController;
  protected get repository() {
    return PlanRepository.getInstance();
  }
  static getInstance() {
    if (!this.instance) this.instance = new PlanController();
    return this.instance;
  }
  async create(params: AddPlanParams, options?: ApiCallOptions) {
    return super.create(
      params,
      { ...options, useJson: true },
      undefined,
      params.status !== PlanStatusEnum.DRAFT,
    );
  }
  async update(
    params: Params,
    options?: ApiCallOptions,
    formKey?: string,
    applyValidation: boolean = true,
  ) {
    return super.update(params, { ...options, useJson: true }, formKey, applyValidation);
  }
  async toggleStatus(params: Params) {
    return this.repository.toggleStatus(params);
  }
  async fetchOne(params: Params, options?: ApiCallOptions) {
    return super.fetchOne(params, {
      ...options,
      headers: { 'Accept-Language': (params as { allLocales?: boolean }).allLocales ? '*' : 'en' },
    });
  }

  async fetchList(params?: Params, options?: ApiCallOptions) {
    return super.fetchList(params, {
      ...options,
      headers: { 'Accept-Language': (params as { allLocales?: boolean }).allLocales ? '*' : 'en' },
    });
  }
}
