import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FaqsController from './faqs.controller';

vi.mock('@/stores/formsStore', () => ({
  useFormsStore: () => ({ clearFormData: vi.fn() }),
}));

vi.mock('@/router', () => ({
  default: { push: vi.fn() },
  push: vi.fn(),
}));

describe('FaqsController', () => {
  let controller: FaqsController;
  let mockRepository: any;

  beforeEach(() => {
    controller = FaqsController.getInstance();

    mockRepository = {
      index: vi.fn(),
      show: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    vi.spyOn(controller as any, 'repository', 'get').mockReturnValue(mockRepository);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the same singleton instance', () => {
    const a = FaqsController.getInstance();
    const b = FaqsController.getInstance();
    expect(a).toBe(b);
  });
});
