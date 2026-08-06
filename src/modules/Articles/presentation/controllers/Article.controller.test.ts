import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import ArticleController from './Article.controller';
import router from '@/router';

const { clearFormDataMock, superCreateMock, superUpdateMock } = vi.hoisted(() => ({
  clearFormDataMock: vi.fn(),
  superCreateMock: vi.fn(),
  superUpdateMock: vi.fn(),
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

    update(...args: unknown[]) {
      return superUpdateMock(...args);
    }
  },
}));

describe('ArticleController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(router.push).mockResolvedValue(undefined);
    (ArticleController as unknown as { instance?: ArticleController }).instance = undefined;
  });

  it('routes a newly created article to question management', async () => {
    superCreateMock.mockResolvedValue(new DataSuccess({ data: { id: 42 } as never }));
    const controller = ArticleController.getInstance();

    await controller.create(
      {
        toMap: () => ({ e_c_subject_id: 284 }),
        questionSequenceId: 308,
      } as never,
      undefined,
      'article-form',
    );

    expect(router.push).toHaveBeenCalledWith({
      name: 'Article questions',
      params: { artical_id: 42 },
      query: { subject_id: 284, sequence_id: 308 },
    });
    expect(clearFormDataMock).toHaveBeenCalledWith('article-form');
  });

  it('keeps creation pending until question-page navigation finishes', async () => {
    superCreateMock.mockResolvedValue(new DataSuccess({ data: { id: 42 } as never }));
    let finishNavigation!: () => void;
    vi.mocked(router.push).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finishNavigation = resolve;
        }),
    );
    const controller = ArticleController.getInstance();

    const createPromise = controller.create(
      {
        toMap: () => ({ e_c_subject_id: 284 }),
        questionSequenceId: 308,
      } as never,
      undefined,
      'article-form',
    );
    await Promise.resolve();

    expect(clearFormDataMock).not.toHaveBeenCalled();

    finishNavigation();
    await createPromise;

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

  it('can update an article without routing before the next workflow step', async () => {
    superUpdateMock.mockResolvedValue(new DataSuccess({ data: { id: 42 } as never }));
    const controller = ArticleController.getInstance();

    await controller.update({} as never, undefined, 'article-form', false);

    expect(router.push).not.toHaveBeenCalled();
    expect(clearFormDataMock).toHaveBeenCalledWith('article-form');
  });
});
