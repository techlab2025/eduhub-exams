import { ref, type Ref } from 'vue';
import type Params from '@/base/Core/Params/params';
import {
  DataInitial,
  DataLoading,
  type DataState,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import BaseController, {
  type ControllerConfig,
} from '@/base/Presentation/Controller/baseController';
import type DocumentIndexPatchModel from '../../core/models/document.index.patch.model';
import type DocumentIndexStatusModel from '../../core/models/document.index.status.model';
import DocumentIndexPatchRepository from '../../data/repositories/document.index.patch.repository';

export default class DocumentIndexPatchController extends BaseController<
  DocumentIndexPatchModel,
  DocumentIndexPatchModel[]
> {
  private static instance: DocumentIndexPatchController;

  public readonly startState: Ref<DataState<void>> = ref(new DataInitial<void>()) as Ref<
    DataState<void>
  >;
  public readonly checkState: Ref<DataState<DocumentIndexStatusModel>> = ref(
    new DataInitial<DocumentIndexStatusModel>(),
  ) as Ref<DataState<DocumentIndexStatusModel>>;

  protected get repository() {
    return DocumentIndexPatchRepository.getInstance();
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

  static getInstance(): DocumentIndexPatchController {
    if (!DocumentIndexPatchController.instance) {
      DocumentIndexPatchController.instance = new DocumentIndexPatchController();
    }
    return DocumentIndexPatchController.instance;
  }

  fetchList(params?: Params, options?: ApiCallOptions): Promise<DataState<DocumentIndexPatchModel[]>> {
    return super.fetchList(params,  {...options , useStaticData:true});
  }
  
  async startIndex(params: Params, options?: ApiCallOptions): Promise<DataState<void>> {
    this.startState.value = new DataLoading<void>();
    const result = await this.repository.startIndex(params, this.mergeOptions(options ));
    this.startState.value = result;
    if (result.hasError) this.handleErrorResponse(result);
    return result;
  }

  async checkStatus(
    params: Params,
    options?: ApiCallOptions,
  ): Promise<DataState<DocumentIndexStatusModel>> {
    this.checkState.value = new DataLoading<DocumentIndexStatusModel>();
    const result = await this.repository.checkStatus(params, this.mergeOptions(options));
    this.checkState.value = result;
    if (result.hasError) this.handleErrorResponse(result);
    return result;
  }
}
