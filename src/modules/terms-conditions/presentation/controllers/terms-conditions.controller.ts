import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type TermsConditionsModel from '../../core/models/terms-conditions.model';
import TermsConditionsRepository from '../../data/repositories/terms-conditions.repository';
// import type { DataState } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
// import type Params from "@/base/Core/Params/params";
// import type { ApiCallOptions } from "@/base/Data/ApiService/baseApiService";

/**
 * Country Controller for managing countries
 *
 * This controller provides methods for CRUD operations on countries.
 */
export default class TermsConditionsController extends BaseController<
  TermsConditionsModel,
  TermsConditionsModel[]
> {
  private static instance: TermsConditionsController;

  protected get repository() {
    return TermsConditionsRepository.getInstance();
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
  static getInstance(): TermsConditionsController {
    if (!TermsConditionsController.instance) {
      TermsConditionsController.instance = new TermsConditionsController();
    }
    return TermsConditionsController.instance;
  }
}
