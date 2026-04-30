// import {
//   DataSuccess,
//   type DataState,
// } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import EducationStageModel from '@/modules/EducationClassification/core/models/EducationStage/education.stages.model';
import EducationStageRepository from '@/modules/EducationClassification/data/repositories/EducationStage/education.stages.repository';

/**
 * Education Classification Controller for managing education classifications
 *
 * This controller provides methods for CRUD operations on education classifications.
 */
export default class EducationStageController extends BaseController<
  EducationStageModel,
  EducationStageModel[]
> {
  private static instance: EducationStageController;

  protected get repository() {
    return EducationStageRepository.getInstance();
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
   * @returns EducationClassificationController instance
   */
  static getInstance(): EducationStageController {
    if (!EducationStageController.instance) {
      EducationStageController.instance = new EducationStageController();
    }
    return EducationStageController.instance;
  }

  async create(params: Params, options?: ApiCallOptions) {
    const result = await super.create(params, { ...options, useStaticData: true });
    return result;
  }
  // async newfetchList(
  //   params?: Params,
  //   options?: ApiCallOptions,
  // ): Promise<DataState<EducationStageModel[]>> {
  //   const result = await super.fetchList(params, { ...options, useStaticData: false });
  //   result.data = [
  //     new EducationStageModel({
  //       stage_id: 5,
  //       has_children: false,
  //       stage_title: 'new',
  //     }),
  //     new EducationStageModel({
  //       stage_id: 6,
  //       has_children: false,
  //       stage_title: 'new 2',
  //     }),
  //     new EducationStageModel({
  //       stage_id: 7,
  //       has_children: false,
  //       stage_title: 'new 3',
  //     }),
  //     new EducationStageModel({
  //       stage_id: 8,
  //       has_children: false,
  //       stage_title: 'new 4',
  //     }),
  //     new EducationStageModel({
  //       stage_id: 9,
  //       has_children: false,
  //       stage_title: 'new 5',
  //     }),
  //     new EducationStageModel({
  //       stage_id: 10,
  //       has_children: false,
  //       stage_title: 'new 6',
  //     }),
  //   ];
  //   console.log(result, 'result');
  //   return result;
  // }
}
