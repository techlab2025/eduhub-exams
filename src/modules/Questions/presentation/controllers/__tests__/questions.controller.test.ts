import { afterEach, describe, expect, it, vi } from 'vitest';
import type Params from '@/base/Core/Params/params';
import {
  DataFailed,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { ErrorModel, ErrorType } from '@/base/Core/NetworkStructure/Resources/errors/errorModel';
import { dialogManager } from '@/base/Presentation/Dialogs/dialog.manager';
import questionsRepository from '@/modules/Questions/data/repositories/question.repository';
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
