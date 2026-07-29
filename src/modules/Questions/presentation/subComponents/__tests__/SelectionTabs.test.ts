import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import SelectionTabs from '../SelectionTabs.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {} }),
}));

const mountComponent = (tabCount: number) =>
  mount(SelectionTabs, {
    props: {
      tabs: Array.from({ length: tabCount }, (_, index) => ({
        id: index + 1,
        title: `tab-${index + 1}`,
      })),
    },
    global: {
      mocks: {
        $t: (key: string) => key,
      },
      stubs: {
        RadioButton: true,
      },
    },
  });

describe('SelectionTabs', () => {
  it.each([3, 5])('sets the grid column count for %i tabs', (tabCount) => {
    const wrapper = mountComponent(tabCount);

    expect(wrapper.get('.all_tabs').attributes('style')).toContain(`--tab-count: ${tabCount}`);
    expect(wrapper.findAll('.tab-item')).toHaveLength(tabCount);
  });
});
