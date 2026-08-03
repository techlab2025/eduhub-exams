import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type { ApiEndpoints } from '@/base/Data/ApiService/baseApiService';
import { PlacementEndpoints } from './placement.api.endpoints';

export default class PlacementApiService extends BaseApiService {
  private static instance: PlacementApiService;

  private readonly placementEndpoints = new PlacementEndpoints();

  /**
   * Singleton instance
   */
  static getInstance(): PlacementApiService {
    if (!PlacementApiService.instance) {
      PlacementApiService.instance = new PlacementApiService();
    }
    return PlacementApiService.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.placementEndpoints.index,
      show: this.placementEndpoints.show,
      create: this.placementEndpoints.store,
      update: this.placementEndpoints.update,
      delete: this.placementEndpoints.delete,
    };
  }
}
