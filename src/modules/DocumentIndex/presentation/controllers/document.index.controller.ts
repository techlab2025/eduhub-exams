import { ref, type Ref } from 'vue';
import type Params from '@/base/Core/Params/params';
import {
  DataCancelled,
  DataInitial,
  DataLoading,
  type DataState,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
import DocumentIndexRepository from '../../data/repositories/document.index.repository';

export default class DocumentIndexController extends BaseController<
  GeneratedDocumentIndexModel,
  GeneratedDocumentIndexModel[]
> {
  private static instance: DocumentIndexController;

  public readonly generatedIndexState: Ref<DataState<GeneratedDocumentIndexModel>> = ref(
    new DataInitial<GeneratedDocumentIndexModel>(),
  ) as Ref<DataState<GeneratedDocumentIndexModel>>;
  public readonly updatedIndexState: Ref<DataState<GeneratedDocumentIndexModel>> = ref(
    new DataInitial<GeneratedDocumentIndexModel>(),
  ) as Ref<DataState<GeneratedDocumentIndexModel>>;
  public readonly savedIndexState: Ref<DataState<void>> = ref(new DataInitial<void>()) as Ref<
    DataState<void>
  >;

  protected get repository() {
    return DocumentIndexRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: false,
      showSuccessDialog: false,
      showSuccessTosat: false,
      showErrorDialog: false,
      showErrorTosat: true,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  static getInstance(): DocumentIndexController {
    if (!DocumentIndexController.instance) {
      DocumentIndexController.instance = new DocumentIndexController();
    }
    return DocumentIndexController.instance;
  }

  async generateIndex(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<GeneratedDocumentIndexModel>> {
    this.generatedIndexState.value = new DataLoading<GeneratedDocumentIndexModel>();
    const result = await this.repository.generateIndex(
      params,
      this.mergeOptions({
        ...options,
        // useStaticData:true,
        timeout: 0,
      }),
    );
    this.generatedIndexState.value = result;

    if (result.hasError && !(result instanceof DataCancelled)) this.handleErrorResponse(result);
    return result;
  }

  async updateIndex(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<GeneratedDocumentIndexModel>> {
    this.updatedIndexState.value = new DataLoading<GeneratedDocumentIndexModel>();
    const result = await this.repository.updateIndex(params, this.mergeOptions(options));
    this.updatedIndexState.value = result;
    if (result.hasError) this.handleErrorResponse(result);
    return result;
  }

  async saveIndex(params: Params, options?: ApiCallOptions): Promise<DataState<void>> {
    this.savedIndexState.value = new DataLoading<void>();
    const result = await this.repository.saveIndex(params, this.mergeOptions(options));
    this.savedIndexState.value = result;
    if (result.hasError) this.handleErrorResponse(result);
    return result;
  }
}
