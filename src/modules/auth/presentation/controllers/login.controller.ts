import BaseController from "@/base/Presentation/Controller/baseController";
import type { ControllerConfig } from "@/base/Presentation/Controller/baseController";
import type LoginModel from "../../core/models/user.model";
import LoginRepository from "../../data/repositories/login.repository";
import type Params from "@/base/Core/Params/params";
import { DataState, DataFailed } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
import { useUserStore } from "@/stores/user";
import router from "@/router";

/**
 * Email Controller for managing employee emails
 *
 * This controller provides methods for CRUD operations on employee emails
 * and specialized queries like fetching emails by employee or type.
 */
export default class LoginController extends BaseController<
  LoginModel,
  LoginModel[]
> {
  private static instance: LoginController;

  protected get repository() {
    return LoginRepository.getInstance();
  }

  //user Store
  private userStore = useUserStore();

  /**
   * Controller configuration
   * Defines behavior for loading, success, and error dialogs
   */
  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: true,
      showSuccessDialog: true,
      showErrorDialog: true,
      autoRetry: true,
      maxAutoRetries: 2,
    };
  }

  private constructor() {
    super();
  }

  /**
   * Get singleton instance
   * @returns EmailController instance
   */
  static getInstance(): LoginController {
    if (!LoginController.instance) {
      LoginController.instance = new LoginController();
    }
    return LoginController.instance;
  }

  async login(params: Params): Promise<DataState<LoginModel>> {
    this.setItemLoading();
    if (this.config.showLoadingDialog) {
      this.showLoadingDialog("Logging in...");
    }

    try {
      const response = await this.repository.login(params);
      this.setItemState(response);

      this.handleItemResponse(response, "Logged in successfully");
      if (response.data) this.userStore.setUser(response.data);
      router.push("/")
      return response;
    } catch (error: any) {
      const failed = new DataFailed<LoginModel>({ error });
      this.setItemState(failed);
      this.handleErrorResponse(failed);
      return failed;
    } finally {
      this.hideLoadingDialog();
    }
  }
}
