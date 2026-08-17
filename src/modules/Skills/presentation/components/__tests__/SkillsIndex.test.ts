import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

const fetchList = vi.fn().mockResolvedValue(undefined);

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {}, params: {}, fullPath: '/skills' }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('../../controllers/skills.controller', () => ({
  default: {
    getInstance: () => ({
      listState: { value: { data: [] } },
      pagination: { value: undefined },
      fetchList,
      delete: vi.fn(),
    }),
  },
}));

import SkillsIndex from '../SkillsIndex.vue';

describe('SkillsIndex', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    fetchList.mockClear();
  });

  it('renders the skills search and add controls and loads the first page', async () => {
    const wrapper = mount(SkillsIndex, {
      global: {
        plugins: [createPinia()],
        mocks: { $t: (key: string) => key },
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          DataStatusBuilder: { template: '<div><slot name="success" :data="[]" /></div>' },
          AppTable: true,
          Pagination: true,
          FilterDialog: true,
          DeleteSkillsDialog: true,
          TableSkelaton: true,
        },
      },
    });

    await Promise.resolve();
    expect(wrapper.find('.search-input').exists()).toBe(true);
    expect(wrapper.find('.btn-add').exists()).toBe(true);
    expect(fetchList).toHaveBeenCalledOnce();
  });
});
