import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type RoleModel from '../../core/models/role.model';
import RoleRepository from '../../data/repositories/role.repository';

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
      showErrorTosat: true,
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
}
