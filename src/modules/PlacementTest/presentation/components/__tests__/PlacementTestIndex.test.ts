import { flushPromises, shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlacementTestIndex from '../PlacementTestIndex.vue';

const { fetchListMock, pushMock } = vi.hoisted(() => ({
  fetchListMock: vi.fn(),
  pushMock: vi.fn(),
}));

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();

  return {
    ...actual,
    useRoute: () => ({ query: {} }),
    useRouter: () => ({ push: pushMock }),
  };
});

vi.mock('../../controllers/placement.test.controller', () => ({
  default: {
    getInstance: () => ({
      fetchList: fetchListMock,
      listState: { value: {} },
      pagination: { value: null },
    }),
  },
}));

describe('PlacementTestIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchListMock.mockResolvedValue(undefined);
  });

  it('loads the first page when the route mounts', async () => {
    shallowMount(PlacementTestIndex);
    await flushPromises();

    expect(fetchListMock).toHaveBeenCalledOnce();
    expect(fetchListMock.mock.calls[0]?.[0]).toMatchObject({
      pageNumber: 1,
      perPage: 10,
      withPage: 1,
    });
  });
});
