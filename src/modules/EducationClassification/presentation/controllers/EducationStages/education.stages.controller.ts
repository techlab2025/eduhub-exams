import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
import type EducationStageModel from '@/modules/EducationClassification/core/models/EducationStage/education.stages.model';
import type EditEducationStageParams from '@/modules/EducationClassification/core/params/EducationStages/edit.education.stage.params';
import EducationStageRepository from '@/modules/EducationClassification/data/repositories/EducationStage/education.stages.repository';

export default class EducationStageController extends BaseController<
  EducationStageModel,
  EducationStageModel[]
> {
  private static instance: EducationStageController;

  protected get repository() {
    return EducationStageRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
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

  static getInstance(): EducationStageController {
    if (!EducationStageController.instance) {
      EducationStageController.instance = new EducationStageController();
    }
    return EducationStageController.instance;
  }

  async create(params: EditEducationStageParams, options?: ApiCallOptions) {
    const translations = Object.values(params.translations?.title ?? {});

    const hasNoTranslations =
      translations.length === 0 || translations.every((value) => !String(value).trim());

    if (hasNoTranslations) {
      dialogManager.toastWarning('Please add at least one translation');
      return;
    }
    return super.create(params, { ...options, useJson: true });
  }

  async update(params: EditEducationStageParams, options?: ApiCallOptions) {
    const translations = Object.values(params.translations?.title ?? {});

    const hasNoTranslations =
      translations.length === 0 || translations.every((value) => !String(value).trim());

    if (hasNoTranslations) {
      dialogManager.toastWarning('Please add at least one translation');
      return;
    }
    return super.update(params, { ...options, useJson: true });
  }

  async delete(params: Params, options?: ApiCallOptions) {
    const result = await super.delete(params, options);
    if (result?.error?.title) {
      dialogManager.toastError(result?.error?.title);
    }
    return result;
  }
}
