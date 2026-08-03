import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import ArticleController from './Article.controller';
import router from '@/router';

const { clearFormDataMock, superCreateMock } = vi.hoisted(() => ({
  clearFormDataMock: vi.fn(),
  superCreateMock: vi.fn(),
}));

vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}));

vi.mock('@/stores/formsStore', () => ({
  useFormsStore: () => ({ clearFormData: clearFormDataMock }),
}));

vi.mock('@/base/Presentation/Controller/baseController', () => ({
  default: class {
    create(...args: unknown[]) {
      return superCreateMock(...args);
    }
  },
}));

describe('ArticleController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ArticleController as unknown as { instance?: ArticleController }).instance = undefined;
  });

  it('routes a newly created article to question management', async () => {
    superCreateMock.mockResolvedValue(new DataSuccess({ data: { id: 42 } as never }));
    const controller = ArticleController.getInstance();

    await controller.create(
      {
        toMap: () => ({ e_c_subject_id: 17 }),
      } as never,
      undefined,
      'article-form',
    );

    expect(router.push).toHaveBeenCalledWith({
      name: 'Article questions',
      params: { artical_id: 42 },
      query: { subject_id: 17 },
    });
    expect(clearFormDataMock).toHaveBeenCalledWith('article-form');
  });

  it('can create an article without routing for Save & New', async () => {
    superCreateMock.mockResolvedValue(new DataSuccess({ data: { id: 42 } as never }));
    const controller = ArticleController.getInstance();

    await controller.create(
      { toMap: () => ({ e_c_subject_id: 17 }) } as never,
      undefined,
      'article-form',
      false,
    );

    expect(router.push).not.toHaveBeenCalled();
    expect(clearFormDataMock).toHaveBeenCalledWith('article-form');
  });

  it('skips full validation when creating a draft', async () => {
    superCreateMock.mockResolvedValue(new DataSuccess({ data: { id: 42 } as never }));
    const controller = ArticleController.getInstance();

    await controller.create(
      { toMap: () => ({ review_status: 4 }) } as never,
      undefined,
      'article-form',
    );

    expect(superCreateMock).toHaveBeenCalledWith(
      expect.anything(),
      { useJson: true },
      undefined,
      false,
    );
  });
});
