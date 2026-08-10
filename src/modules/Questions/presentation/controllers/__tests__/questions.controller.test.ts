import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import type Params from '@/base/Core/Params/params';
import {
  DataFailed,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
import questionsRepository from '@/modules/Questions/data/repositories/question.repository';
import EditquestionsParams from '@/modules/Questions/core/params/edit.question.params';
import AddquestionsParams from '@/modules/Questions/core/params/add.question.params';
import QuestionSkillParams from '@/modules/Questions/core/params/subParams/question.skills.params';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import questionsController from '../questions.controller';

const createParams = (): Params => ({
  toMap: () => ({}),
  validate: () => ({ isValid: true, errors: [] }),
  validateOrThrow: () => undefined,
});

describe('questionsController.updateReviewStatus', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a success toast when the repository returns success', async () => {
    const result = new DataSuccess({ data: null });
    vi.spyOn(questionsRepository.getInstance(), 'updateReviewStatus').mockResolvedValue(result);
    const toastSuccessSpy = vi
      .spyOn(dialogManager, 'toastSuccess')
      .mockImplementation(() => undefined);

    expect(await questionsController.getInstance().updateReviewStatus(createParams())).toBe(result);
    expect(toastSuccessSpy).toHaveBeenCalledOnce();
  });

  it('does not show a success toast when the repository returns a failure', async () => {
    const result = new DataFailed({
      error: new ErrorModel('Request failed', ErrorType.serviceSide),
    });
    vi.spyOn(questionsRepository.getInstance(), 'updateReviewStatus').mockResolvedValue(result);
    const toastSuccessSpy = vi
      .spyOn(dialogManager, 'toastSuccess')
      .mockImplementation(() => undefined);

    expect(await questionsController.getInstance().updateReviewStatus(createParams())).toBe(result);
    expect(toastSuccessSpy).not.toHaveBeenCalled();
  });
});

describe('questionsController.update', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('skips class validation when saving a draft', async () => {
    const params = new EditquestionsParams({ id: 1, status: QuestionStatusEnum.DRAFT });
    const result = new DataSuccess({ data: null });
    const validateSpy = vi.spyOn(params, 'validate');
    const updateSpy = vi
      .spyOn(questionsRepository.getInstance(), 'update')
      .mockResolvedValue(result);

    expect(await questionsController.getInstance().update(params)).toBe(result);
    expect(validateSpy).not.toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it('keeps class validation enabled for non-draft updates', async () => {
    const params = new EditquestionsParams({ id: 1, status: QuestionStatusEnum.APPROVED });
    const validateSpy = vi.spyOn(params, 'validate').mockReturnValue({ isValid: true, errors: [] });
    vi.spyOn(questionsRepository.getInstance(), 'update').mockResolvedValue(
      new DataSuccess({ data: null }),
    );

    await questionsController.getInstance().update(params);

    expect(validateSpy).toHaveBeenCalled();
  });
});

describe('questionsController skill percentage validation', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([0, 100, -1, 101, Number.NaN])(
    'blocks non-draft creation when a skill percentage is %s',
    async (percentage) => {
      const params = new AddquestionsParams({
        status: QuestionStatusEnum.APPROVED,
        skills: [new QuestionSkillParams({ skillId: 76, percentage })],
      });
      const toastWarningSpy = vi
        .spyOn(dialogManager, 'toastWarning')
        .mockImplementation(() => undefined);
      const createSpy = vi.spyOn(questionsRepository.getInstance(), 'create');

      expect(await questionsController.getInstance().create(params)).toBeUndefined();
      expect(toastWarningSpy).toHaveBeenCalledWith(
        'skill percentage should be greater than 0 and less than 100',
      );
      expect(createSpy).not.toHaveBeenCalled();
    },
  );

  it('blocks non-draft updates when any skill percentage is invalid', async () => {
    const params = new EditquestionsParams({
      id: 1,
      status: QuestionStatusEnum.APPROVED,
      skills: [
        new QuestionSkillParams({ skillId: 76, percentage: 25 }),
        new QuestionSkillParams({ skillId: 77, percentage: 0 }),
      ],
    });
    const toastWarningSpy = vi
      .spyOn(dialogManager, 'toastWarning')
      .mockImplementation(() => undefined);
    const updateSpy = vi.spyOn(questionsRepository.getInstance(), 'update');

    expect(await questionsController.getInstance().update(params)).toBeUndefined();
    expect(toastWarningSpy).toHaveBeenCalledWith(
      'skill percentage should be greater than 0 and less than 100',
    );
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('allows invalid skill percentages when saving a draft', async () => {
    const params = new EditquestionsParams({
      id: 1,
      status: QuestionStatusEnum.DRAFT,
      skills: [new QuestionSkillParams({ skillId: 76, percentage: 0 })],
    });
    const result = new DataSuccess({ data: null });
    const toastWarningSpy = vi
      .spyOn(dialogManager, 'toastWarning')
      .mockImplementation(() => undefined);
    vi.spyOn(questionsRepository.getInstance(), 'update').mockResolvedValue(result);

    expect(await questionsController.getInstance().update(params)).toBe(result);
    expect(toastWarningSpy).not.toHaveBeenCalled();
  });
});
