import BaseController from "@/base/Presentation/Controller/baseController";
import type { ControllerConfig } from "@/base/Presentation/Controller/baseController";
import type { ApiCallOptions } from "@/base/Data/ApiService/baseApiService";
import type Params from "@/base/Core/Params/params";
import { DataSuccess } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
import router from "@/router";
import { useFormsStore } from "@/stores/formsStore";
import type StageModel from "../../core/models/stage.model";
import StageRepository from "../../data/repositories/stage.repository";

/**
 * Country Controller for managing countries
 *
 * This controller provides methods for CRUD operations on countries.
 */
export default class StageController extends BaseController<
  StageModel,
  StageModel[]
> {
  private static instance: StageController;

  protected get repository() {
    return StageRepository.getInstance();
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
      autoRetry: true,
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
  static getInstance(): StageController {
    if (!StageController.instance) {
      StageController.instance = new StageController();
    }
    return StageController.instance;
  }

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.create(params, options);
    if (result instanceof DataSuccess) {
      router.push({ name: "Countries" });
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
      router.push({ name: "Countries" });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }
  // Override fetchAsOptions to return full StageModel data
async fetchAsOptions(params?: Params, options?: ApiCallOptions) {
  await this.fetchList(params, options);
  if (!this.isListSuccess()) return [];
  // ارجع الـ StageModel كامل مش TitleInterface
  return (this.listData.value ?? []) as StageModel[];
}
}
