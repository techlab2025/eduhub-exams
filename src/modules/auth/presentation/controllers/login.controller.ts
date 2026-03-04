import BaseController from "@/base/Presentation/Controller/baseController";
import type { ControllerConfig } from "@/base/Presentation/Controller/baseController";
import type LoginModel from "../../core/models/login.model";
import LoginRepository from "../../data/repositories/login.repository";

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

  /**
   * Controller configuration
   * Defines behavior for loading, success, and error dialogs
   */
  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: true,
      showErrorDialog: true,
      autoRetry: false,
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
}
