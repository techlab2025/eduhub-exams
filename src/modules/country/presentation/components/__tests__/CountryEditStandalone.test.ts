import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CountryEditStandalone from '../CountryEditStandalone.vue';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    fullPath: '/admin/country/edit/1',
    query: {},
    params: { id: '1' },
  }),
  createRouter: vi.fn(() => ({
    install: vi.fn(),
    push: vi.fn(),
    resolve: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
    currentRoute: { value: { path: '/admin/country/edit/1' } },
  })),
  createWebHistory: vi.fn(),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

vi.mock('../controllers/country.standalone.controller', () => ({
  default: {
    getInstance: () => ({
      update: vi.fn(),
      fetchOne: vi.fn(),
      itemData: { value: null },
      errorMessage: { value: null },
    }),
  },
}));

describe('CountryEditStandalone', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = mount(CountryEditStandalone, {
      global: {
        stubs: {
          Teleport: true,
          Transition: true,
          TransitionGroup: true,
          'router-link': true,
          'router-view': true,
          CountryForm: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
