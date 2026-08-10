import BaseController from '@/base/Presentation/Controller/baseController';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type PlanFeatureModel from '../../core/models/planFeature.model';
import PlanFeatureRepository from '../../data/repositories/planFeature.repository';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

export default class PlanFeatureController extends BaseController<
  PlanFeatureModel,
  PlanFeatureModel[]
> {
  private static instance: PlanFeatureController;
  protected get repository() {
    return PlanFeatureRepository.getInstance();
  }
  static getInstance() {
    if (!this.instance) this.instance = new PlanFeatureController();
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

  async fetchList(
    params?: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<PlanFeatureModel[]>> {
    return super.fetchList(params, {
      ...options,
      useJson: true,
      useStaticData: true,
      headers: { 'Accept-Language': (params as { allLocales?: boolean }).allLocales ? '*' : 'en' },
    });
  }
}
