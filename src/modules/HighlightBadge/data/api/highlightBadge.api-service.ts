import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { HighlightBadgeEndpoints } from './highlightBadge.api.endpoints';

export default class HighlightBadgeApiService extends BaseApiService {
  private static instance: HighlightBadgeApiService;
  private readonly featureEndpoints = new HighlightBadgeEndpoints();

  static getInstance() {
    if (!this.instance) this.instance = new HighlightBadgeApiService();
    return this.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.featureEndpoints.index,
      create: this.featureEndpoints.store,
      show: this.featureEndpoints.show,
      update: this.featureEndpoints.update,
      delete: this.featureEndpoints.delete,
    };
  }
}
