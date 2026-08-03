import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import router from '@/router';
import { useFormsStore } from '@/stores/formsStore';
import type PlacementModel from '../../core/models/placement.model';
import placementRepository from '../../data/repositories/placement.repository';
import PlacementResultModel from '../../core/models/placementResult';

export default class PlacementController extends BaseController<PlacementModel, PlacementResultModel[]> {
  private static instance: PlacementController;

  protected get repository() {
    return placementRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showSuccessTosat: true,
      showErrorDialog: false,
      showErrorTosat: true,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  static getInstance(): PlacementController {
    if (!PlacementController.instance) {
      PlacementController.instance = new PlacementController();
    }
    return PlacementController.instance;
  }

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.create(params, { ...options, useJson: true });
    if (result instanceof DataSuccess) {
      router.push({ name: 'Placements' });
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
      router.push({ name: 'Placements' });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }
}
