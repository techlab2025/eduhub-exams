import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import type EmployeePermissionModel from '../../core/models/employee.permission.model';
import PermissionRepository from '../../data/repositories/permission.repository';

export default class PermissionController extends BaseController<
  EmployeePermissionModel,
  EmployeePermissionModel[]
> {
  private static instance: PermissionController;

  protected get repository() {
    return PermissionRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showSuccessTosat: true,
      showErrorDialog: false,
      showErrorTosat: true,
      autoRetry: false,
    };
  }

  static getInstance(): PermissionController {
    if (!this.instance) this.instance = new PermissionController();
    return this.instance;
  }

  storeEmployeePermissions(params: Params, options?: ApiCallOptions) {
    return this.create(params, { ...options, useJson: true });
  }
}
