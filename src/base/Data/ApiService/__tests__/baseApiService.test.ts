import type { AxiosResponse } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import NetworkService from '@/base/Core/NetworkStructure/networking/networkService';
import BaseApiService from '../baseApiService';

class TestApiService extends BaseApiService {
  protected get endpoints() {
    return {};
  }
}

describe('BaseApiService custom requests', () => {
  afterEach(() => vi.restoreAllMocks());

  it('preserves retry options supplied to customPost', async () => {
    const post = vi.spyOn(NetworkService.instance, 'post').mockResolvedValue({
      data: { success: true },
      status: 200,
      headers: {},
    } as AxiosResponse);

    await new TestApiService().customPost('/custom', undefined, {
      enableRetry: false,
      retryOptions: { maxAttempts: 2 },
    });

    expect(post).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/custom' }),
      expect.objectContaining({
        enableRetry: false,
        retryOptions: { maxAttempts: 2 },
      }),
    );
  });
});
