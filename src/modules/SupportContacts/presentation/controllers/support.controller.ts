import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import SupportContactsRepository from '../../data/repositories/support.repository';
import SupportContactsModel from '../../core/models/support.contatcts.model';
import type { DataState } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';

export default class SupportContactsController extends BaseController<
  SupportContactsModel,
  SupportContactsModel[]
> {
  private static instance: SupportContactsController;

  protected get repository() {
    return SupportContactsRepository.getInstance();
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

  static getInstance(): SupportContactsController {
    if (!SupportContactsController.instance) {
      SupportContactsController.instance = new SupportContactsController();
    }
    return SupportContactsController.instance;
  }

  async create(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<SupportContactsModel> | undefined> {
    return await super.create(params, { ...options, useJson: true });
  }
}
