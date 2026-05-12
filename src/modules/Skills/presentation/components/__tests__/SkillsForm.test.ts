import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SkillsForm from '../SkillsForm.vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  useRoute: () => ({
    params: {},
  }),
}));

const globalConfig = {
  plugins: [createPinia()],
  stubs: {
    MultiLangInput: true,
  },
  mocks: {
    $t: (msg: string) => msg,
  },
};

describe('SkillsForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(SkillsForm, { global: globalConfig });
    expect(wrapper.exists()).toBe(true);
  });
});
