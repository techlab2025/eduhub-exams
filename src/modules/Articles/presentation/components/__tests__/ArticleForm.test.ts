import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import ArticleForm from '../ArticleForm.vue';

const { toastWarningMock } = vi.hoisted(() => ({
  toastWarningMock: vi.fn(),
}));

vi.mock('@/base/Presentation/Dialogs/dialog.manager', () => ({
  dialogManager: {
    toastWarning: toastWarningMock,
  },
}));

const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: {} } });

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
    params: { id: '1' },
    fullPath: '/eg/articles/edit/1',
  }),
  createRouter: vi.fn(() => ({
    getRoutes: vi.fn(() => []),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
  })),
  createWebHistory: vi.fn(),
}));

// Mock document module
vi.mock('@/modules/document', () => ({
  DocumentController: {
    getInstance: () => ({
      fetchList: vi.fn(),
    }),
  },
  IndexDocumentParams: class {},
}));

describe('ArticleForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = mount(ArticleForm, {
      global: {
        plugins: [i18n],
        stubs: {
          Accordion: true,
          AccordionPanel: true,
          AccordionHeader: true,
          AccordionContent: true,
          Checkbox: true,
          HandleFilesUpload: true,
          UpdatedCustomInputSelect: true,
          FolderCrudIcon: true,
          UploadFileIcon: true,
          AccordionToggleIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('shows inline errors and a warning toast when required fields are missing', async () => {
    const wrapper = mount(ArticleForm, {
      global: {
        plugins: [i18n],
        stubs: {
          Accordion: { template: '<div><slot /></div>' },
          AccordionPanel: { template: '<div><slot /></div>' },
          AccordionHeader: { template: '<div><slot /></div>' },
          AccordionContent: { template: '<div><slot /></div>' },
          Checkbox: true,
          HandleFilesUpload: true,
          UpdatedCustomInputSelect: true,
          FolderCrudIcon: true,
          UploadFileIcon: true,
          AccordionToggleIcon: true,
        },
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

    const isValid = await (
      wrapper.vm as unknown as { validateRequiredFields: () => Promise<boolean> }
    ).validateRequiredFields();

    expect(isValid).toBe(false);
    expect(wrapper.findAll('.required-field-message')).toHaveLength(5);
    expect(toastWarningMock).toHaveBeenCalledWith('article_validation_warning', {
      title: 'invalid_input_warning_title',
    });
  });
});
