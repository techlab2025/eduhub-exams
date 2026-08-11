import BaseController from '@/base/Presentation/Controller/baseController';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import type HighlightBadgeModel from '../../core/models/highlightBadge.model';
import HighlightBadgeRepository from '../../data/repositories/highlightBadge.repository';

export default class HighlightBadgeController extends BaseController<
  HighlightBadgeModel,
  HighlightBadgeModel[]
> {
  private static instance: HighlightBadgeController;
  protected get repository() {
    return HighlightBadgeRepository.getInstance();
  }
  static getInstance() {
    if (!this.instance) this.instance = new HighlightBadgeController();
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
  async fetchList(params?: Params, options?: ApiCallOptions) {
    return super.fetchList(params, { ...options });
  }
}
