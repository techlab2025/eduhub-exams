import BaseController from "@/base/Presentation/Controller/baseController";
import type { ControllerConfig } from "@/base/Presentation/Controller/baseController";
import EmailModel from "../../core/models/email.model";
import EmailRepository from "../../data/repositories/email.repository";
import type { ApiCallOptions } from "@/base/Data/ApiService/baseApiService";
import type Params from "@/base/Core/Params/params";
import { DataSuccess } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
import router from "@/router";
import { useFormsStore } from "@/stores/formsStore";

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

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.create(params, options);
    if (result instanceof DataSuccess) {
      router.push({ name: "Employee Emails" });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }

  async update(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.update(params, options);
    if (result instanceof DataSuccess) {
      router.push({ name: "Employee Emails" });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }
}
