import BaseController from "@/base/Presentation/Controller/baseController";
import type { ControllerConfig } from "@/base/Presentation/Controller/baseController";
import EmailModel from "../../core/models/email.model";
import EmailRepository from "../../data/repositories/email.repository";

/**
 * Email Controller for managing employee emails
 *
 * This controller provides methods for CRUD operations on employee emails
 * and specialized queries like fetching emails by employee or type.
 */
export default class EmailController extends BaseController<
  EmailModel,
  EmailModel[]
> {
  private static instance: EmailController;

  protected get repository() {
    return EmailRepository.getInstance();
  }

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
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  /**
   * Get singleton instance
   * @returns EmailController instance
   */
  static getInstance(): EmailController {
    if (!EmailController.instance) {
      EmailController.instance = new EmailController();
    }
    return EmailController.instance;
  }
}
