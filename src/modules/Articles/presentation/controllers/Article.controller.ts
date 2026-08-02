import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import router from '@/router';
import { useFormsStore } from '@/stores/formsStore';
import ArticleRepository from '../../data/repositories/Artical.repository';
import type { questionsModel } from '@/modules/Questions';
import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';

export default class ArticleController extends BaseController<
  ShowQuestionsModel,
  questionsModel[]
> {
  private static instance: ArticleController;

  protected get repository() {
    return ArticleRepository.getInstance();
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

  static getInstance(): ArticleController {
    if (!ArticleController.instance) {
      ArticleController.instance = new ArticleController();
    }
    return ArticleController.instance;
  }

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    const result = await super.create(params, { ...options, useJson: true });
    if (result instanceof DataSuccess) {
      const articleId = result.data?.question_id ?? result.data?.id;
      if (articleId) {
        router.push({ name: 'Article questions', params: { artical_id: articleId } });
      } else {
        router.push({ name: 'Articles' });
      }
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
      router.push({ name: 'Articles' });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }
  async delete(params: Params, options?: ApiCallOptions) {
    const result = await super.delete(params, options);
    if (result?.error?.title) {
      dialogManager.toastError(result?.error?.title);
    }
    return result;
  }
}
