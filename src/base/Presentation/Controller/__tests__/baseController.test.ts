import { describe, expect, it, vi } from 'vitest';
import type Params from '@/base/Core/Params/params';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import type BaseRepository from '@/base/Domain/Repositories/baseRepository';
import BaseController from '../baseController';

class TestController extends BaseController<unknown> {
  constructor(private readonly testRepository: BaseRepository<unknown, unknown[]>) {
    super();
  }

  protected get repository(): BaseRepository<unknown, unknown[]> {
    return this.testRepository;
  }
}

describe('BaseController.update', () => {
  it('skips params validation when applyValidation is false', async () => {
    const result = new DataSuccess({ data: null });
    const update = vi.fn().mockResolvedValue(result);
    const repository = { update } as unknown as BaseRepository<unknown, unknown[]>;
    const controller = new TestController(repository);
    const params: Params = {
      toMap: () => ({}),
      validate: vi.fn(() => ({ isValid: false, errors: [] })),
      validateOrThrow: vi.fn(),
    };

    expect(await controller.update(params, undefined, undefined, false)).toBe(result);
    expect(params.validate).not.toHaveBeenCalled();
    expect(params.validateOrThrow).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });
});
