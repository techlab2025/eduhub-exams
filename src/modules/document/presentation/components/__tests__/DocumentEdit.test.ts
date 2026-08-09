import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import DocumentEdit from '../DocumentEdit.vue';

const fetchOneMock = vi.hoisted(() => vi.fn());
const updateMock = vi.hoisted(() => vi.fn());
const validateMock = vi.hoisted(() => vi.fn());
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

vi.mock('@/modules/document/presentation/controllers/document.controller', () => ({
  default: {
    getInstance: () => ({
      fetchOne: fetchOneMock,
      update: updateMock,
      itemData: { value: null },
      errorMessage: { value: '' },
    }),
  },
}));

// Mock vue-router
vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    resolve: vi.fn(),
  }),
  useRoute: () => ({
    query: {},
    params: {},
  }),
  createRouter: vi.fn(() => ({
    install: vi.fn(),
    push: vi.fn(),
    resolve: vi.fn(),
    afterEach: vi.fn(),
    beforeEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

// Mock PrimeVue
vi.mock('primevue/config', () => ({
  usePrimeVue: () => ({
    config: { ripple: true },
  }),
}));

// Mock Controller if it exists in the same directory (simplified)
// This is to avoid issues with controllers that might have side effects
// vi.mock('../controllers/document.controller', () => ({
//   default: {
//     getInstance: () => ({
//       listState: { value: {} },
//       fetchList: vi.fn(),
//       pagination: { value: {} }
//     })
//   }
// }))

describe('DocumentEdit', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = mount(DocumentEdit, {
      global: {
        plugins: [i18n],
        stubs: {
          Teleport: true,
          Transition: true,
          TransitionGroup: true,
          'router-link': true,
          'router-view': true,
          // PrimeVue
          DataTable: true,
          Column: true,
          Button: true,
          InputText: true,
          Dialog: true,
          Toast: true,
          Select: true,
          MultiSelect: true,
          Dropdown: true,
          FileUpload: true,
          Card: true,
          Accordion: true,
          AccordionTab: true,
          Tree: true,
          Breadcrumb: true,
        },
        mocks: {
          $t: (msg: string) => msg,
          $d: (d: unknown) => d,
          $n: (n: unknown) => n,
          $tc: (msg: string) => msg,
        },
        directives: {
          ripple: {},
          tooltip: {},
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('shows form validation and does not update when required edit data is missing', async () => {
    validateMock.mockResolvedValue(false);
    const wrapper = mount(DocumentEdit, {
      global: {
        plugins: [i18n],
        stubs: {
          DocumentForm: {
            name: 'DocumentForm',
            methods: { validate: validateMock },
            template: '<div />',
          },
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    wrapper.findComponent({ name: 'DocumentForm' }).vm.$emit('updateData', {
      subjects: 1,
      stage_id: 1,
      tags: [],
      images: '',
      files: '',
      translations: {},
      documentTypeId: 1,
    });
    await wrapper.find('button[type="submit"]').trigger('click');

    expect(validateMock).toHaveBeenCalledOnce();
    expect(updateMock).not.toHaveBeenCalled();
  });
});
