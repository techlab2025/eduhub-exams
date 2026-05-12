import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type DocumentModel from '../../core/models/document.model';
import DocumentRepository from '../../data/repositories/document.repository';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import {
  type DataState,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import router from '@/router';
import { useFormsStore } from '@/stores/formsStore';

export default class DocumentController extends BaseController<DocumentModel, DocumentModel[]> {
  private static instance: DocumentController;

  protected get repository() {
    return DocumentRepository.getInstance();
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

  static getInstance(): DocumentController {
    if (!DocumentController.instance) {
      DocumentController.instance = new DocumentController();
    }
    return DocumentController.instance;
  }

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.create(params, { ...options, useJson: true });
    if (result instanceof DataSuccess) {
      router.push({ name: 'Documents' });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }

  async update(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.update(params, { ...options, useJson: true });
    if (result instanceof DataSuccess) {
      router.push({ name: 'Documents' });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }
  async fetchList(params: Params, options?: ApiCallOptions): Promise<DataState<DocumentModel[]>> {
    const result = await super.fetchList(params, { ...options, useJson: true });
    return result;
  }
}
