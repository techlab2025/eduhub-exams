import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type TermsConditionsModel from '../../core/models/terms-conditions.model';
import TermsConditionsRepository from '../../data/repositories/terms-conditions.repository';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import router from '@/router';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';

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
      showSuccessDialog: false,
      showErrorDialog: false,
      showErrorTosat: true,
      showSuccessTosat: true,
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

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    // const FormStore = useFormsStore();

    const result = await super.create(params, { ...options, useJson: true });
    if (result instanceof DataSuccess) {
      router.push({ name: 'TermsConditions' });
      // if (formKey) {
      // FormStore.clearFormData(formKey);
      // }
    }
    return result;
  }

  async fetchOne(params: Params, options?: ApiCallOptions) {
    const result = await super.fetchOne(params, {
      ...options,
      useJson: true,
      headers: { 'Accept-Language': params.allLocales ? '*' : 'en' },
    });
    return result;
  }
  async fetchList(params?: Params, options?: ApiCallOptions): Promise<DataState<PrivacyModel[]>> {
    const result = await super.fetchList(params, {
      ...options,
      headers: {
        'Accept-Language': '*',
      },
    });
    return result;
  }
}
