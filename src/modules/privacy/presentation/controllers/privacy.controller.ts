import BaseController from "@/base/Presentation/Controller/baseController";
import type { ControllerConfig } from "@/base/Presentation/Controller/baseController";
import type { ApiCallOptions } from "@/base/Data/ApiService/baseApiService";
import type Params from "@/base/Core/Params/params";
import { DataSuccess } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
import router from "@/router";
import { useFormsStore } from "@/stores/formsStore";
import type PrivacyModel from "../../core/models/privacy.model";
import PrivacyRepository from "../../data/repositories/privacy.repository";

/**
 * Country Controller for managing countries
 *
 * This controller provides methods for CRUD operations on countries.
 */
export default class PrivacyController extends BaseController<
  PrivacyModel,
  PrivacyModel[]
> {
  private static instance: PrivacyController;

  protected get repository() {
    return PrivacyRepository.getInstance();
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
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  /**
   * Get singleton instance
   * @returns CountryController instance
   */
  static getInstance(): PrivacyController {
    if (!PrivacyController.instance) {
      PrivacyController.instance = new PrivacyController();
    }
    return PrivacyController.instance;
  }

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.create(params, { ...options, useJson: true });
    if (result instanceof DataSuccess) {
      router.push({ name: "Faqs" });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }
}
