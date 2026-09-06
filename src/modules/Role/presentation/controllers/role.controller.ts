import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type RoleModel from '../../core/models/role.model';
import RoleRepository from '../../data/repositories/role.repository';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';

export default class RoleController extends BaseController<RoleModel, RoleModel[]> {
  private static instance: RoleController;

  protected get repository(): RoleRepository {
    return RoleRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showSuccessTosat: true,
      showErrorDialog: false,
      showErrorTosat: false,
      autoRetry: false,
    };
  }

  private constructor() {
    super();
  }

  static getInstance(): RoleController {
    if (!this.instance) this.instance = new RoleController();
    return this.instance;
  }

  create(params: Params, options?: ApiCallOptions): Promise<DataState<RoleModel> | undefined> {
    return super.create(params, { ...options, useJson: true });
  }
  fetchOne(params: Params, options?: ApiCallOptions): Promise<DataState<RoleModel>> {
    return super.fetchOne(params, {
      ...options,
      useJson: true,
      headers: {
        'accept-language': '*',
      },
    });
  }
}
