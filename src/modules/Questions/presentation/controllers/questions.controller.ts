import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type { ApiCallOptions } from '@/base/Data/ApiService/baseApiService';
import type Params from '@/base/Core/Params/params';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import router from '@/router';
import { useFormsStore } from '@/stores/formsStore';
import type questionsModel from '../../core/models/questions.model';
import questionsRepository from '../../data/repositories/question.repository';
import type ShowQuestionsModel from '../../core/models/show.questions.model';
import type AddquestionsParams from '../../core/params/add.question.params';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
import { QuestionTypeEnum } from '../../core/constant/question.type.enum';
import { AnswerEvaluationTypeEnum } from '../../core/constant/answer.evaluation.type.enum';
import { QuestionStatusEnum } from '../../core/constant/question.status.enum';

export default class questionsController extends BaseController<
  ShowQuestionsModel,
  questionsModel[]
> {
  private static instance: questionsController;

  protected get repository() {
    return questionsRepository.getInstance();
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

  static getInstance(): questionsController {
    if (!questionsController.instance) {
      questionsController.instance = new questionsController();
    }
    return questionsController.instance;
  }

  async create(params: AddquestionsParams, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    console.log(params, 'params');
    if (params.status != QuestionStatusEnum.DRAFT) {
      if (
        (params.questionType === QuestionTypeEnum.mcq &&
          params.answers?.filter((answer) => answer.isCorrect).length === 0) ||
        (params.questionType === QuestionTypeEnum.true_false &&
          params.answers?.filter((answer) => answer.isCorrect).length === 0)
      ) {
        dialogManager.toastWarning('one or more answers should be correct');
        return;
      }
      if (
        // check if float make warning it must be integer
        params.questionType === QuestionTypeEnum.ranking &&
        params.answers?.some((answer) => answer.rank && Number(answer.rank) % 1 !== 0)
      ) {
        dialogManager.toastWarning('rank should be an integer');
        return;
      }
      console.log(params, 'params.answers');
      if (params.questionType === QuestionTypeEnum.true_false && params.answers?.length! > 2) {
        dialogManager.toastWarning('answers count should be 2');
        return;
      }
      if (
        params.answers &&
        params.answers.length < 2 &&
        params.answerEvaluation !== AnswerEvaluationTypeEnum.need_correct
      ) {
        dialogManager.toastWarning('answers count should be more than 2');
        return;
      }
      if (
        params.questionType === QuestionTypeEnum.complate &&
        params.answerEvaluation === AnswerEvaluationTypeEnum.similar &&
        (!params.similarPrecentage ||
          Number(params.similarPrecentage) <= 1 ||
          Number(params.similarPrecentage) > 100)
      ) {
        dialogManager.toastWarning('similar precentage should be between 1 and 100');
        return;
      }
    }

    const result = await super.create(params, { ...options, useJson: true }, false);
    if (result instanceof DataSuccess) {
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }

  async update(params: AddquestionsParams, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();

    if (params.status != QuestionStatusEnum.DRAFT) {
      if (
        (params.questionType === QuestionTypeEnum.mcq &&
          params.answers?.filter((answer) => answer.isCorrect).length === 0) ||
        (params.questionType === QuestionTypeEnum.true_false &&
          params.answers?.filter((answer) => answer.isCorrect).length === 0)
      ) {
        dialogManager.toastWarning('one or more answers should be correct');
        return;
      }
      if (
        // check if float make warning it must be integer
        params.questionType === QuestionTypeEnum.ranking &&
        params.answers?.some((answer) => answer.rank && Number(answer.rank) % 1 !== 0)
      ) {
        dialogManager.toastWarning('rank should be an integer');
        return;
      }
      console.log(params, 'params.answers');
      if (params.questionType === QuestionTypeEnum.true_false && params.answers?.length! > 2) {
        dialogManager.toastWarning('answers count should be 2');
        return;
      }
      if (
        params.answers &&
        params.answers.length < 2 &&
        params.answerEvaluation !== AnswerEvaluationTypeEnum.need_correct
      ) {
        dialogManager.toastWarning('answers count should be more than 2');
        return;
      }
      if (
        params.questionType === QuestionTypeEnum.complate &&
        params.answerEvaluation === AnswerEvaluationTypeEnum.similar &&
        (!params.similarPrecentage ||
          Number(params.similarPrecentage) <= 1 ||
          Number(params.similarPrecentage) > 100)
      ) {
        dialogManager.toastWarning('similar precentage should be between 1 and 100');
        return;
      }
    }

    const result = await super.update(params, options);
    if (result instanceof DataSuccess) {
      router.push({ name: 'Questions' });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }

  async delete(params: Params) {
    const result = await super.delete(params);
    dialogManager.toastSuccess('Question deleted successfully');
    return result;
  }

  async updateReviewStatus(params: Params) {
    const result = await this.repository.updateReviewStatus(params);
    dialogManager.toastSuccess('Review status updated successfully');

    return result;
  }
}
