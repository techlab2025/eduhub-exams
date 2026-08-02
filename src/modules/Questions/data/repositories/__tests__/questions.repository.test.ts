import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import questionsRepository from '../question.repository';
import QuestionApiService from '../../api/question.api-service';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type Params from '@/base/Core/Params/params';

const createParams = (): Params => ({
  toMap: () => ({}),
  validate: () => ({ isValid: true, errors: [] }),
  validateOrThrow: () => undefined,
});

describe('questionsRepository', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(questionsRepository).toBeDefined();
  });

  it('should get correct instance', () => {
    const repository = questionsRepository.getInstance();
    expect(repository).toBeInstanceOf(questionsRepository);
  });

  it('returns success when the review-status endpoint returns partial question data', async () => {
    vi.spyOn(QuestionApiService.getInstance(), 'updateReviewStatus').mockResolvedValue({
      statusCode: 200,
      data: {
        data: { id: 10, review_status: 6 },
        message: 'Review status updated successfully',
      },
    });

    const result = await questionsRepository.getInstance().updateReviewStatus(createParams());

    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.data).toBe(true);
    expect(result.error).toBeNull();
  });
});
