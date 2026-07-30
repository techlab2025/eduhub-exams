import { describe, expect, it, vi } from 'vitest';
import type Params from '@/base/Core/Params/params';
import QuestionApiService from './question.api-service';

const createParams = (): Params => ({
  toMap: () => ({}),
  validate: () => ({ isValid: true, errors: [] }),
  validateOrThrow: () => undefined,
});

describe('QuestionApiService', () => {
  it('disables automatic retries when updating review status', async () => {
    const service = QuestionApiService.getInstance();
    const response = { data: {}, statusCode: 200 };
    const customPostSpy = vi.spyOn(service, 'customPost').mockResolvedValue(response);
    const params = createParams();

    await service.updateReviewStatus(params);

    expect(customPostSpy).toHaveBeenCalledWith(expect.any(String), params, {
      enableRetry: false,
    });
  });
});
