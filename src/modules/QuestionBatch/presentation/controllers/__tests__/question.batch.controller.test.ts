import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GeneratedQuestionBatchModel from '../../../core/models/generated.question.batch.model';

const generateBatch = vi.fn();
const show = vi.fn();
vi.mock('../../../data/repositories/question.batch.repository', () => ({
  default: { getInstance: () => ({ generateBatch, show }) },
}));

import QuestionBatchController from '../question.batch.controller';

describe('QuestionBatchController', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads an approved batch from static data for viewing', async () => {
    show.mockResolvedValue(new DataSuccess({ data: GeneratedQuestionBatchModel.example }));
    const params = { toMap: vi.fn(), validate: vi.fn(), validateOrThrow: vi.fn() };

    await QuestionBatchController.getInstance().fetchOne(params);

    expect(show).toHaveBeenCalledWith(
      params,
      expect.objectContaining({ useStaticData: true }),
      false,
    );
  });

  it('disables timeout and retries for generation', async () => {
    generateBatch.mockResolvedValue(new DataSuccess({ data: GeneratedQuestionBatchModel.example }));
    const params = { toMap: vi.fn(), validate: vi.fn(), validateOrThrow: vi.fn() };
    const signal = new AbortController().signal;
    await QuestionBatchController.getInstance().generateBatch(params, { signal });
    expect(generateBatch).toHaveBeenCalledWith(params, {
      signal,
      timeout: 0,
      enableRetry: false,
      useStaticData: true,
    });
  });
});
