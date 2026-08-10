import BaseController from '@/base/Presentation/Controller/baseController';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type PlanModel from '../../core/models/plan.model';
import PlanRepository from '../../data/repositories/plan.repository';

export default class PlanController extends BaseController<PlanModel, PlanModel[]> {
  private static instance: PlanController;
  protected get repository() {
    return PlanRepository.getInstance();
  }
  static getInstance() {
    if (!this.instance) this.instance = new PlanController();
    return this.instance;
  }
  async create(params: Params, options?: ApiCallOptions) {
    return super.create(params, { ...options, useJson: true });
  }
  async update(params: Params, options?: ApiCallOptions) {
    return super.update(params, { ...options, useJson: true });
  }
  async fetchOne(params: Params, options?: ApiCallOptions) {
    return super.fetchOne(params, {
      ...options,
      headers: { 'Accept-Language': (params as { allLocales?: boolean }).allLocales ? '*' : 'en' },
    });
  }
}
