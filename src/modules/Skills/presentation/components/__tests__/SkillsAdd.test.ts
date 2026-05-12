import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SkillsAdd from '../SkillsAdd.vue';

// Mock dependencies
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    fullPath: '/skills/add',
  })),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock('../controllers/skills.controller', () => ({
  default: {
    getInstance: () => ({
      create: vi.fn(),
      errorMessage: { value: '' },
    }),
  },
}));

const globalConfig = {
  plugins: [createPinia()],
  stubs: {
    SkillsForm: true,
  },
  mocks: {
    $t: (msg: string) => msg,
  },
};

describe('SkillsAdd.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(SkillsAdd, { global: globalConfig });
    expect(wrapper.exists()).toBe(true);
  });

  it('contains the "save" button', () => {
    const wrapper = mount(SkillsAdd, { global: globalConfig });
    const saveButton = wrapper.find('.btn-primary');
    expect(saveButton.exists()).toBe(true);
  });

  it('contains the "cancel" button', () => {
    const wrapper = mount(SkillsAdd, { global: globalConfig });
    const cancelButton = wrapper.find('.btn-cancel');
    expect(cancelButton.exists()).toBe(true);
  });
});
