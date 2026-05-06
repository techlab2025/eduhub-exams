import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AdminEdit from '../AdminEdit.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/admin/edit/1',
    params: { id: '1' },
  }),
  createRouter: vi.fn(() => ({
    install: vi.fn(),
    push: vi.fn(),
    resolve: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
    currentRoute: { value: { path: '/admin' } },
  })),
  createWebHistory: vi.fn(),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('AdminEdit', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = mount(AdminEdit, {
      global: {
        stubs: {
          'router-link': true,
          AppButton: true,
          IconAccept: true,
          AdminForm: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
