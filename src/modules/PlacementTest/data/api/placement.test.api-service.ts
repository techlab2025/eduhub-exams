import BaseApiService from '@/base/Data/ApiService/baseApiService';
import type {
  ApiCallOptions,
  ApiEndpoints,
  ApiResponse,
} from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { PlacementTestEndpoints } from './placement.test.api.endpoints';

export default class PlacementApiService extends BaseApiService {
  private static instance: PlacementApiService;

  private readonly placementTestEndpoints = new PlacementTestEndpoints();

  static getInstance(): PlacementApiService {
    if (!PlacementApiService.instance) {
      PlacementApiService.instance = new PlacementApiService();
    }
    return PlacementApiService.instance;
  }

  protected get endpoints(): Partial<ApiEndpoints> {
    return {
      index: this.placementTestEndpoints.index,
      show: this.placementTestEndpoints.show,
    };
  }

  showStudentProfile(params: Params, options?: ApiCallOptions): Promise<ApiResponse> {
    return this.customPost(this.placementTestEndpoints.showStudentProfile, params, options);
  }
}
