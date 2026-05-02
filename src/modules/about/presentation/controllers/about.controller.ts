import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type AboutModel from '../../core/models/about.model';
import AboutRepository from '../../data/repositories/about.repository';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';

export default class AboutController extends BaseController<AboutModel, AboutModel[]> {
  private static instance: AboutController;

  protected get repository() {
    return AboutRepository.getInstance();
  }

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

  static getInstance(): AboutController {
    if (!AboutController.instance) {
      AboutController.instance = new AboutController();
    }
    return AboutController.instance;
  }
  async create(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<AboutModel> | undefined> {
    return await super.create(params, { ...options, useJson: true });
  }
}
