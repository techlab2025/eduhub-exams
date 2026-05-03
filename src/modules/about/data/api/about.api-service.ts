import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { AboutEndpoints } from './about.api.endpoints';

export default class AboutApiService extends BaseApiService {
  private static instance: AboutApiService;

  private readonly aboutEndpoints = new AboutEndpoints();

  /**
   * Singleton instance
   */
  static getInstance(): AboutApiService {
    if (!AboutApiService.instance) {
      AboutApiService.instance = new AboutApiService();
    }
    return AboutApiService.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.aboutEndpoints.index,
      show: this.aboutEndpoints.show,
      create: this.aboutEndpoints.store,
      update: this.aboutEndpoints.update,
      delete: this.aboutEndpoints.delete,
    };
  }
}
