import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import router from '@/router';
import { useFormsStore } from '@/stores/formsStore';
import EducationClassificationRepository from '../../data/repositories/educationClassification.repository';
import type EducationClassificationModel from '../../core/models/education.classification.model';
import type EditEducationClassificationParams from '../../core/params/edit.educationClassification.params';
import type AddEducationClassificationParams from '../../core/params/add.educationClassification.params';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
import { hasEmptyTranslationKey } from '@/base/Presentation/Utils/ChecktranslationEmpty';
import IndexEducationClassificationParams from '../../core/params/index.educationClassification.params';

const MAX_TITLE_LENGTH = 150;

const hasTitleOverMaxLength = (title?: Record<string, string>) =>
  ['ar', 'en'].some((locale) => (title?.[locale] ?? '').length > MAX_TITLE_LENGTH);

/**
 * Education Classification Controller for managing education classifications
 *
 * This controller provides methods for CRUD operations on education classifications.
 */
export default class EducationClassificationController extends BaseController<
  EducationClassificationModel,
  EducationClassificationModel[]
> {
  private static instance: EducationClassificationController;

  protected get repository() {
    return EducationClassificationRepository.getInstance();
  }

  /**
   * Controller configuration
   * Defines behavior for loading, success, and error dialogs
   */
  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showErrorTosat: true,
      showSuccessTosat: true,
      showErrorDialog: false,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  /**
   * Get singleton instance
   * @returns EducationClassificationController instance
   */
  static getInstance(): EducationClassificationController {
    if (!EducationClassificationController.instance) {
      EducationClassificationController.instance = new EducationClassificationController();
    }
    return EducationClassificationController.instance;
  }

  async create(
    params: AddEducationClassificationParams,
    options?: ApiCallOptions,
    formKey?: string,
  ) {
    const FormStore = useFormsStore();

    if (hasTitleOverMaxLength(params.translation.title)) {
      dialogManager.toastWarning('Title should not exceed 150 characters');
      return;
    }

    const result = await super.create(params, { ...options, useJson: true });
    await super.fetchList(
      new IndexEducationClassificationParams({
        word: '',
        pageNumber: 1,
        perPage: 10,
        withPage: 1,
        date: '',
        order: 1,
      }),
    );
    if (result instanceof DataSuccess) {
      router.push({ name: 'EducationClassifications' });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }

  async fetchList(params?: Params, options?: ApiCallOptions) {
    return super.fetchList(params, {
      ...options,
      useJson: true,
      headers: {
        'Accept-Language': (params as any)?.isLocale ? 'ar' : 'en',
      },
    });
  }

  async update(
    params: EditEducationClassificationParams,
    options?: ApiCallOptions,
    formKey?: string,
  ) {
    const FormStore = useFormsStore();

    if (hasEmptyTranslationKey(params.translations, 'title')) {
      dialogManager.toastWarning('You Must Add Title');
      return;
    }
    if (hasTitleOverMaxLength(params.translations.title)) {
      dialogManager.toastWarning('Title should not exceed 150 characters');
      return;
    }
    const result = await super.update(params, options);

    if (result instanceof DataSuccess) {
      router.push({ name: 'EducationClassifications' });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }

  async toggleStatus(params: Params) {
    const result = await this.repository.toggleStatus(params);
    return result;
  }
}
