import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ShowArticleDetails from '../ShowArticleDetails.vue';

const { fetchOneMock } = vi.hoisted(() => ({ fetchOneMock: vi.fn() }));

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();

  return {
    ...actual,
    useRoute: () => ({ params: { id: '17' } }),
  };
});

vi.mock('../../../controllers/Article.controller', () => ({
  default: {
    getInstance: () => ({
      itemState: { value: { data: { id: 17 } } },
      fetchOne: fetchOneMock,
    }),
  },
}));

describe('ShowArticleDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchOneMock.mockResolvedValue(undefined);
  });

  it('loads the routed article and refreshes it when its questions change', async () => {
    const wrapper = mount(ShowArticleDetails, {
      global: {
        stubs: {
          OverViewArticle: true,
          ArticleQuestion: true,
        },
      },
    });
    await flushPromises();

    expect(fetchOneMock).toHaveBeenCalledTimes(1);
    expect(fetchOneMock.mock.calls[0]?.[0].toMap()).toMatchObject({ question_id: 17 });

    wrapper.getComponent({ name: 'ArticleQuestion' }).vm.$emit('update-data');
    await flushPromises();

    expect(fetchOneMock).toHaveBeenCalledTimes(2);
  });
});
